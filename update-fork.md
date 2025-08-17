# 🛠 How to Update My Feature Branch with Latest Changes from `upstream/main`

## 1. Add `upstream` remote (if not already added)

```bash
git remote add upstream https://github.com/cyruzzo/AboveVTT
```

## 2. Switch to your local `main` branch

```bash
git checkout main
```

## 3. Fetch the latest changes from `upstream`

```bash
git fetch upstream
```

## 4. Merge `upstream/main` into your local `main`

```bash
git merge upstream/main
```

## 5. Push the updated `main` to your GitHub fork

```bash
git push origin main
```

## 6. Switch to your feature branch

```bash
git checkout <your-branch>
```

## 7. Merge the updated `main` into your feature branch

```bash
git merge main
```

### 🧼 Optional: Rebase instead of merge for a cleaner history

```bash
git rebase main
```
