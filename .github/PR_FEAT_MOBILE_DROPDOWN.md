<!--
PR draft: feat/mobile-dropdown -> main
This file is a ready-made PR description you can paste into GitHub when creating the PR or use with `gh pr create --fill`.
-->

# feat(calendar+analytics): calendar button + vercel analytics import + lint cleanup

## Summary
- Switch Vercel Analytics import to `@vercel/analytics/react` in `app/layout.tsx` so the Analytics component works with the Next.js App Router.
- Simplify calendar UI: `components/calendar-agent-section.tsx` now shows a single button linking to the Hugging Face Calendar-Agent space.
- ESLint migration: moved to ESLint v9 flat config (`eslint.config.cjs`), added `@typescript-eslint` parser/plugin, and auto-fixed trivial issues.

## What changed
- `package.json` (restored/enabled lint script, upgraded ESLint to v9)
- Added `eslint.config.cjs` (flat-style config) and `.eslintrc.cjs` (legacy placeholder); removed `.eslintrc.json`.
- `components/calendar-agent-section.tsx` simplified to a single external-link button.
- `app/layout.tsx` import switched to `@vercel/analytics/react` and cleaned unused imports.
- Ran `npx eslint --fix` and applied safe cleanup edits to reduce lint warnings.

## Notes & verification
- I ran `npm run build` locally; the Next build succeeded.
- ESLint now runs under v9 and reports warnings (mostly unused variables) — I reduced the noisy ones; ~38 warnings remain.
- I did NOT change any Vercel project settings or merge this branch into `main`.

## How to create the PR (recommended)
1. If you have GitHub CLI and are authenticated: run
```bash
gh pr create --base main --head feat/mobile-dropdown --title "feat(calendar+analytics): calendar button + vercel analytics import + lint cleanup" --body-file .github/PR_FEAT_MOBILE_DROPDOWN.md
```

2. Or use the web UI: visit
   https://github.com/iprajwallkurs/main-project/compare/main...feat/mobile-dropdown
   then click "Create pull request" and paste the contents of this file as the PR description.

## Post-merge steps (if you want Analytics enabled)
1. Merge this PR into `main`.
2. In Vercel dashboard -> Project -> Settings -> Analytics: enable Analytics for the project.
3. Wait for the deployment to complete; Vercel will inject the analytics script into production builds when Analytics is enabled.

---
If you want, I can open the PR for you (I tried but the GH CLI here isn't authenticated). I can also continue cleaning the remaining ESLint warnings and push follow-up commits.
