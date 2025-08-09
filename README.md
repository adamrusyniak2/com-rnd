# Clouds on Mars – Interactive Microsite

This repo contains a small React (Vite) + Tailwind site you can deploy with **Azure Static Web Apps**.
No command line needed if you prefer GitHub web.

## Quick Steps (No Terminal)

1. **Download** this ZIP and unpack it.
2. Go to **github.com** → new repo → name it `com-rnd` (or anything).
3. Click **Add file → Upload files**, drag the **entire folder** here. Click **Commit**.
4. In **Azure Portal** → **Static Web Apps** → **Create**:
   - **Source**: GitHub, select your repo and branch `main`.
   - **Build presets**: React.
   - **App location**: `/`
   - **Output location**: `dist`
5. Finish creation. Azure adds a workflow in your repo. Wait until **Actions** completes.
6. Your site URL appears in the resource overview. Share that link.

## Local Run (Optional)
If you want to preview locally (needs Node 18+):
```bash
npm i
npm run dev
```
