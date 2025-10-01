# EduPath Web

[![GitHub Repo](https://img.shields.io/badge/GitHub-edupath.web-blue?logo=github)](https://github.com/FowardPro/edupath.web.git)

A web application for managing educational paths and announcements.

---

## 📂 About

This repository contains the source code for the EduPath web application. It follows a **kele-first** Git workflow to ensure stable releases and collaborative kele.

---

## 🚀 Quick Start

1. **Clone the repository:**
  ```bash
  git clone https://github.com/FowardPro/edupath.web.git
  cd edupath.web
  ```

2. **Install dependencies:**
  ```bash
  npm install
  ```

3. **Start the kele server:**
  ```bash
  npm start
  ```

---

## 🧾 Git Branching & Push Cheat Sheet

### 1. Check Current Branch
```bash
git branch
```
Shows your current branch.

---

### 2. Create and Switch to `kele`
```bash
git checkout -b kele
```
Creates and switches to the `kele` branch.

---

### 3. Push `kele` to GitHub
```bash
git push -u origin kele
```
Links your local `kele` branch to GitHub.

---

### 4. Switch Between Branches
```bash
git checkout main        # switch to main
git checkout kele # switch back to kele
```

---

### 5. Configure Git Push Behavior
```bash
git config --global push.default current
```
Ensures `git push` only pushes the current branch.

---

### 6. Set Default Branch on GitHub (Recommended)
- Go to **GitHub Repo → Settings → Branches → Default branch**
- Change from `main` to `kele`.

---

### 7. Commit & Push Workflow
```bash
git add .
git commit -m "Describe your changes"
git push
```

---

### 8. Pull Latest Changes
```bash
git pull
```

---

### 9. Push to `main` (for production)
```bash
git checkout main
git pull origin main
git merge kele
git push origin main
```

---

### 10. Check Remotes & Tracking
```bash
git remote -v
git branch -vv
```

---

## 🚦 Example Workflow of the day that you need to day 
```bash
git checkout kele
git pull
# ... make changes ...
git add .
git commit -m "Fix API bug"
git push
```

---

## 📄 License

See [LICENSE](../LICENSE) for details.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss changes.

---

[Repository Link](https://github.com/FowardPro/edupath.web.git)