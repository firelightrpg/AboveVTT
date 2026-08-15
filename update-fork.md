# 🛠 How to Update My Feature Branch with Latest Changes from `upstream/main`

## 1. Add `upstream` remote (if not already added)

```bash
git remote add upstream https://github.com/cyruzzo/AboveVTT
```

## 2. Update main from remote and merge into branch

```
# 1. Update local metadata and tags from upstream
git fetch upstream --tags

# 2. Check the Chrome Web Store / extension page for the published version (e.g., 1.58)
# https://chromewebstore.google.com/detail/abovevtt/ipcjcbhpofedihcloggaichibomadlei
ver=1.58

# 3. Fast-forward local main to the exact release tag
git checkout main
git reset --hard $ver

# 4. Sync your fork's main to the release tag
git push origin main --force-with-lease

# 5. Bring your custom branch up to date with the published base
git checkout -
git merge main
```
