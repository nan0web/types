# @nan0web/types — Next Steps

## v1.5.0 — Performance Optimization (In Progress)

- [ ] **Single-pass Scanner**: Реалізувати потокове читання символів у `Parser.js`.
- [ ] **Zero-Allocation**: Усунути `split('\n')` та мінімізувати створення об'єктів `Node`.
- [ ] **RegExp Cache/Optimization**: Оптимізувати перевірку типів (`Number`, `Date`).

## v1.4.1 — Schema & Modular Docs ✅ 

- [x] **Benchmarking**: Порівняння швидкості з JSON/YAML/MD.
- [x] **Schema-Aware Parsing**: Авто-типізація через `Body` модель.
- [x] **Comment Order Fix**: Виправлено черговість коментарів.
- [x] **Modular Documentation**: Спліт README на `docs/` розділи.
- [x] **Regression**: Контракт релізу перенесено у `src/test/releases`.

## v1.4.0 — Total Logic Isolation & i18n Contract ✅ 

- [x] **TFunction**: Централізовано контракт перекладу в `@nan0web/types`.
- [x] **Recursive Plurals**: Підтримка вкладених об'єктів перекладу.
- [x] **Numeric Shorthand**: Число як автоматичний $count для змінних (apples: 5).
- [x] **ModelError**: Структуровані помилки валідації з підтримкою TFunction.
- [x] **resolveValidation**: Валідація за метаданими з викиданням ModelError.
- [x] **Refactoring**: Розділення на `/domain` та `/utils`.
- [x] **Test Migration**: Перехід на `describe > it` та 270/270 PASS.
- [x] **Documentation**: Оновлено README.md.js та README.md (EN/UK).

---

_Оновлено: 2026-03-25_

# Бенчмарк `NaN0` vs `YAML` vs `JSON` vs `MD` ✅

(Тут результати бенчмарку з v1.4.1)
...
