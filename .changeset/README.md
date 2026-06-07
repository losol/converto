# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

When you make a change worth releasing, add a changeset:

```bash
pnpm changeset
```

Pick the bump type (`patch` / `minor` / `major`) and write a short summary —
it becomes the `CHANGELOG.md` entry. Commit the generated file in `.changeset/`
alongside your change.

## How releases happen

1. PRs land on `main` with changeset files.
2. The **Release** workflow opens (and keeps updating) a "Version Packages" PR
   that bumps the version in `package.json` and updates `CHANGELOG.md`.
3. Merging that PR tags `v<version>` and creates a GitHub Release, which kicks
   off the Docker workflow to publish `losolio/converto:<version>` + `latest`.

This package is `private` and never published to npm — changesets is used only
for versioning, the changelog, and the release tag.
