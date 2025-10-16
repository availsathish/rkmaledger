# RKM Customer Ledger

This is a ready-to-deploy **React (TypeScript)** project containing your `App.tsx` (imported from your uploaded `rkm-ledger-app.tsx`).

## How to use

1. Unzip and open the folder.
2. Install dependencies:
```bash
npm install
```
3. Run app locally:
```bash
npm start
```
4. To deploy to GitHub Pages:
 - Make sure your GitHub repo is named `rkm-ledger` (or update `homepage` in package.json).
 - Push the project to your GitHub repo.
 - Run:
```bash
npm run deploy
```
Your site will be available at: `https://availsathish.github.io/rkm-ledger/`

## Notes
- The uploaded file `rkm-ledger-app.tsx` has been placed into `src/App.tsx`.
- If you prefer deployment on Vercel instead of GitHub Pages, remove `homepage` and the `gh-pages` scripts.
