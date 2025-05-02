
# 🛠 How to Update My Fork’s `main` from `upstream`

## 1. Add `upstream` remote (if not already added)
```bash
git remote add upstream https://github.com/cyruzzo/AboveVTT
```

## 2. Fetch latest changes from `upstream`
```bash
git fetch upstream
```

## 3. Switch to your local `main` branch
```bash
git checkout main
```

## 4. Merge or rebase changes from `upstream/main`
**Merge (safe & simple):**
```bash
git merge upstream/main
```

**Or Rebase (cleaner history):**
```bash
git rebase upstream/main
```

## 5. Push to your GitHub fork
```bash
git push origin main
```
