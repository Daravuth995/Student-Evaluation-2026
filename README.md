# Student Evaluation Portal — Aurora Indigo Edition

A modern, animated, bilingual (English + Khmer) student evaluation dashboard built with **React + Vite + TypeScript + Tailwind v4 + Framer Motion + Recharts**.

The frontend talks **directly** to the existing Google Apps Script backend. There is **no Node server** to deploy — the production output is a folder of static files (`dist/public/`) that you can host on any static host: GitHub Pages, Vercel, Netlify, Cloudflare Pages, Firebase Hosting, S3, etc.

## Authentication

Login requires **both** Student ID **and** Password. The flow:
1. Fetch the student record by ID from the backend.
2. Compare the entered password against the `Password` field returned by the backend.
3. On match → dashboard loads. On mismatch → "Incorrect password".

Use the **Hint** button to retrieve the password hint from the backend if a student forgets.

---

## Features

- Aurora Indigo palette (indigo → violet → fuchsia) with light + dark modes
- Single-page scrolling layout (sticky header, payment banner, points/coupon, monthly bar, 6 criterion cards, overall ring, feedback cards, teacher comments, history line chart)
- Bilingual labels (English + Khmer)
- Score guide modal (auto-opens on login, auto-closes after 20s)
- Send-points modal with recent-transfer history
- Restriction modal (when backend returns a Restriction value)
- Floating scroll-to-top button
- Fully responsive; respects system theme on first visit

---

## 1) Run locally on Windows (CMD / PowerShell)

### Prerequisites
- **Node.js 20+** — https://nodejs.org (download the LTS installer)
- **Git** — https://git-scm.com/download/win
- (Optional) **pnpm**: `npm install -g pnpm`

### Steps
```cmd
:: 1. Get the code (if you cloned this repo)
git clone <YOUR_GITHUB_URL>.git
cd <repo-name>\artifacts\student-portal

:: 2. Install dependencies (npm works fine; you don't need pnpm)
npm install

:: 3. Start the dev server (port 5173 by default)
set PORT=5173
set BASE_PATH=/
npx vite --config vite.config.ts

:: Open http://localhost:5173 in your browser
```

### Build the production bundle
```cmd
set PORT=5173
set BASE_PATH=/
set NODE_ENV=production
npx vite build --config vite.config.ts
```
The output is in **`dist/public/`** — that folder is your deployable website.

> Tip (PowerShell uses different syntax): `$env:PORT=5173; $env:BASE_PATH="/"; npx vite build`

---

## 2) Deploy to GitHub + GitHub Pages (free)

GitHub Pages serves your build output as static files at `https://<your-user>.github.io/<repo-name>/`.
Because the URL has a sub-path, set **`BASE_PATH=/<repo-name>/`** when you build.

### Step A — Create a GitHub repository
1. Sign in at **https://github.com** and click **New repository**.
2. Name it (e.g. `student-portal`), keep it public, do **not** add a README, click **Create**.

### Step B — Push your code
Open CMD inside the project folder you downloaded:
```cmd
cd path\to\student-portal
git init
git add .
git commit -m "Initial commit: Aurora Indigo student portal"
git branch -M main
git remote add origin https://github.com/<your-user>/student-portal.git
git push -u origin main
```

### Step C — Add a GitHub Actions deploy workflow
Create the file `.github/workflows/deploy.yml` in the repo root:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - working-directory: artifacts/student-portal
        run: npm install
      - working-directory: artifacts/student-portal
        env:
          PORT: 5173
          BASE_PATH: /student-portal/   # MUST match your repo name (with leading + trailing slash)
          NODE_ENV: production
        run: npx vite build --config vite.config.ts
      - uses: actions/upload-pages-artifact@v3
        with:
          path: artifacts/student-portal/dist/public
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Commit & push:
```cmd
git add .github
git commit -m "Add GitHub Pages workflow"
git push
```

### Step D — Enable Pages
1. In your repo on github.com → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Wait ~1 minute for the workflow to finish (watch the **Actions** tab).
4. Your site will be live at `https://<your-user>.github.io/student-portal/`.

> **If the dashboard appears unstyled or blank**, you almost certainly used the wrong `BASE_PATH`. Edit the workflow so `BASE_PATH` exactly matches `/<repo-name>/` (slashes on both sides), then push again.

---

## 3) Even simpler: deploy to Vercel or Netlify

Both detect Vite automatically. Use these settings:

| Setting          | Value                                      |
|------------------|--------------------------------------------|
| Framework        | Vite                                       |
| Root directory   | `artifacts/student-portal`                 |
| Install command  | `npm install`                              |
| Build command    | `npx vite build --config vite.config.ts`   |
| Output directory | `dist/public`                              |
| Env: `PORT`      | `5173`                                     |
| Env: `BASE_PATH` | `/`                                        |
| Env: `NODE_ENV`  | `production`                               |

Push to GitHub once and connect the repo on **vercel.com** or **netlify.com** — every push redeploys automatically.

---

## Backend

This frontend calls the existing Google Apps Script endpoints (defined in `src/lib/api.ts`):

- `SCRIPT_URL` — student data, password hint, comments, history, coupons
- `POINTS_BACKEND_URL` — points login, send points, recent transfers

**No backend code is included or required** in this project. If the script URLs ever change, edit `src/lib/api.ts` and rebuild.

---

## Folder layout

```
artifacts/student-portal/
├── index.html              # entry HTML + Google Fonts (Inter, Noto Sans Khmer)
├── package.json
├── vite.config.ts          # reads PORT and BASE_PATH from env
├── src/
│   ├── App.tsx             # login ↔ dashboard switch
│   ├── main.tsx
│   ├── index.css           # Aurora Indigo palette + utilities
│   ├── types.ts
│   ├── lib/
│   │   ├── api.ts          # fetch wrappers for the 2 Apps Script URLs
│   │   ├── scoring.ts      # tier logic, avatar helper, date helpers
│   │   └── utils.ts
│   ├── hooks/useTheme.ts   # light/dark with localStorage
│   └── components/
│       ├── LoginScreen.tsx
│       ├── Dashboard.tsx
│       ├── StudentHeader.tsx
│       ├── PaymentBanner.tsx
│       ├── MonthlyPerformance.tsx
│       ├── CriteriaGrid.tsx
│       ├── CriterionCard.tsx
│       ├── OverallScore.tsx
│       ├── FeedbackCards.tsx
│       ├── CommentsSection.tsx
│       ├── PerformanceChart.tsx
│       ├── ScoreGuideModal.tsx
│       ├── SendPointsModal.tsx
│       ├── RestrictionModal.tsx
│       └── ThemeToggle.tsx
└── dist/public/            # production build output (created by `vite build`)
```

---

## License
Internal use — Indigo Education.
