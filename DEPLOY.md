# Deploy to GitHub + Vercel

## One-time setup (~5 minutes)

### Step 1 — Create GitHub account
Go to https://github.com → Sign Up → verify email

### Step 2 — Create a new repository
1. Click the **+** icon top right → New repository
2. Name it: `interview-trainer`
3. Keep it Public
4. Click **Create repository**
5. GitHub shows you a page with commands — leave it open

### Step 3 — Open Terminal on your computer
On Mac: press Cmd+Space, type Terminal, press Enter
On Windows: press Win+R, type cmd, press Enter

### Step 4 — Run these exact commands
```bash
# Unzip the project (adjust path if needed)
tar -xzf ~/Downloads/interview-trainer.tar.gz
cd interview-trainer

# Set up git
git init
git add .
git commit -m "initial commit"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/interview-trainer.git
git branch -M main
git push -u origin main
```

GitHub will ask for your username and password.
For password: use a Personal Access Token (not your real password)
→ github.com → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → check "repo" → copy the token → paste as password

### Step 5 — Deploy on Vercel
1. Go to https://vercel.com → Sign Up with GitHub (one click)
2. Click **Add New Project**
3. Find `interview-trainer` in the list → click **Import**
4. Vercel auto-detects Vite — don't change anything
5. Click **Deploy**
6. Wait 30 seconds → your URL appears (e.g. interview-trainer-abc123.vercel.app)
7. Open that URL on your phone → bookmark it

---

## After any bug fix (30 seconds)
```bash
cd interview-trainer
git add .
git commit -m "describe what you fixed"
git push
```
Vercel auto-redeploys. Same URL. No other action needed.

---

## Your URLs
- GitHub repo: https://github.com/YOUR_USERNAME/interview-trainer
- Live app: https://interview-trainer-[random].vercel.app
