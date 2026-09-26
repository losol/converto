#!/usr/bin/env bash
#
# Runs on the weekly schedule in .github/workflows/release.yml, before the
# changesets action. If runtime-relevant commits (typically Dependabot bumps)
# have landed on main since the last release tag and nobody has added a
# changeset for them, it writes a patch changeset into the working tree. The
# changesets action then consumes it into the "Version Packages" PR, so the file
# is never committed to main.
#
set -euo pipefail

PACKAGE="$(jq -r '.name' package.json)"

# Changesets already pending on main -> the normal flow handles the release.
if find .changeset -name '*.md' ! -name 'README.md' | grep -q .; then
  echo "Pending changesets found — skipping auto changeset."
  exit 0
fi

LAST_TAG="$(git describe --tags --abbrev=0 --match 'v*' 2>/dev/null || true)"
if [ -z "$LAST_TAG" ]; then
  echo "No release tag found — skipping auto changeset."
  exit 0
fi

# Only count changes that end up in the shipped image.
COMMITS="$(git log "$LAST_TAG"..HEAD --no-merges --invert-grep --grep='^Version Packages$' \
  --format='- %s (%h)' -- \
  src public Dockerfile package.json pnpm-lock.yaml)"

if [ -z "$COMMITS" ]; then
  echo "No runtime changes since $LAST_TAG — nothing to release."
  exit 0
fi

FILE=".changeset/auto-maintenance-$(date -u +%Y%m%d).md"
{
  printf -- '---\n"%s": patch\n---\n\n' "$PACKAGE"
  printf 'Maintenance release with dependency updates since %s:\n\n' "$LAST_TAG"
  printf '%s\n' "$COMMITS"
} >"$FILE"

echo "Wrote $FILE:"
cat "$FILE"
