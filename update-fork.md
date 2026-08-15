# 🛠 How to Update My Feature Branch with Latest Changes from `upstream/main`

## 1. Add `upstream` remote (if not already added)

```bash
git remote add upstream https://github.com/cyruzzo/AboveVTT
```

## 2. Update main from remote and merge into branch

```
git checkout main && git fetch upstream && git merge upstream/main && git push && git checkout - && git merge main
```
