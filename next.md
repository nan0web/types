# @nan0web/types — Next Steps

## v1.3.0 ✅ (Current)

- [x] `resolveAliases()` — alias resolution for Model-as-Schema
- [x] `resolveDefaults()` — default values from static class metadata
- [x] Fix NaN0.TAB (two spaces for NaN0 format)
- [x] Fix NaN0 parseArrayWithComments: nested objects
- [x] Fix Parser tests alignment with default tab
- [x] Fix Enum tests resilience across Node.js versions
- [x] Fix README.md.js loadDocument handling for .md files
- [x] Fix leading-zero number parsing (0123 → string)
- [x] Add CONTRIBUTING.md
- [x] Add test:all script
- [x] 259/259 pass, 0 fail

## v1.4.0 — Release Infrastructure & NaN0 Improvements

- [ ] **AGRP Release Protocol**: Створити `releases/` структуру, `task.spec.js`, `release:spec`, `release:verify`, `release:close` скрипти
- [ ] Fix TODO: `should parse number as string if it defined by Body type` — NaN0 parse з Body schema
- [ ] Fix TODO: `How to parse retrieve comments from the source` — comment extraction
- [ ] `resolveAliases` → перенести до базового `@nan0web/core` пакету

---

_Оновлено: 2026-03-02_
