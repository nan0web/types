# @nan0web/types — Next Steps

## v1.5.0 — Total Logic Isolation & i18n Contract ✅ (Current)

- [x] **TFunction**: Централізовано контракт перекладу в `@nan0web/types`.
- [x] **Recursive Plurals**: Підтримка вкладених об'єктів перекладу.
- [x] **Numeric Shorthand**: Число як автоматичний $count для змінних (apples: 5).
- [x] **ModelError**: Структуровані помилки валідації з підтримкою TFunction.
- [x] **resolveValidation**: Валідація за метаданими з викиданням ModelError.
- [x] **Refactoring**: Розділення на `/domain` та `/utils`.
- [x] **Test Migration**: Перехід на `describe > it` та 270/270 PASS.
- [x] **Documentation**: Оновлено README.md.js та README.md (EN/UK).

## v1.6.0 — Future Improvements

- [ ] `resolveAliases` → перенести до базового `@nan0web/core` пакету.
- [ ] Fix TODO: `should parse number as string if it defined by Body type` — NaN0 parse з Body schema.
- [ ] Fix TODO: `How to parse retrieve comments from the source` — comment extraction.
- [ ] **AGRP Release Protocol**: Впровадити `releases/` структуру та автоматизовану верифікацію.

---

_Оновлено: 2026-03-09_
