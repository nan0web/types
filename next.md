# 🏗️ Architecture Audit — Healing Report

**Score: {passed}/{total} ({pct}%)**

## Issues Found
- [ ] [exports] src/index.js: `Default export found in {file} — only named exports allowed`
- [ ] [exports] src/domain/index.js: `src/domain/ exists but src/domain/index.js is missing`
- [ ] [exports] exports["./ui/vscode"]: `UI adapter dir {dir}/ exists but not declared in package.json exports`
- [ ] [domain] /Users/i/src/nan.web/packages/types/src/README.md.js: `Model class outside src/domain/ in {file}`

## Recommended Subagents
- `@[/inspect-anti-pattern]`
- `@[/inspect-models]`
