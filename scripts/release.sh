#!/usr/bin/env bash
#
# Runs as the changesets "publish" step in .github/workflows/release.yml.
# It only fires when there are no pending changesets left — i.e. right after the
# "Version Packages" PR is merged. It tags the new version, cuts a GitHub
# Release from the CHANGELOG, and triggers the Docker workflow.
#
set -euo pipefail

VERSION="v$(jq -r '.version' package.json)"

if git rev-parse "$VERSION" >/dev/null 2>&1; then
  echo "Tag $VERSION already exists — nothing to release."
  exit 0
fi

echo "Releasing $VERSION"

# Pull this version's section out of CHANGELOG.md for the release notes.
NOTES_FILE="$(mktemp)"
awk -v ver="${VERSION#v}" '
  $0 ~ "^## " ver "($|[^0-9.])" { capture = 1; next }
  capture && /^## / { exit }
  capture { print }
' CHANGELOG.md >"$NOTES_FILE"
[ -s "$NOTES_FILE" ] || echo "See CHANGELOG.md" >"$NOTES_FILE"

git tag "$VERSION"
git push origin "$VERSION"

gh release create "$VERSION" --title "$VERSION" --notes-file "$NOTES_FILE"

# A tag pushed with GITHUB_TOKEN does not trigger other workflows (GitHub's
# recursion guard), so kick off the Docker build explicitly on the new tag.
gh workflow run docker.yml --ref "$VERSION"
