# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-03-26

### Added
- **VS Code Extension**: Built-in `nan0-vscode` extension with syntax highlighting (TextMate grammar) and document formatting via `NaN0.parse` + `NaN0.stringify` round-trip.
- **Build Pipeline**: esbuild bundling to single 15.9 KB CJS file, VSIX packaging (9.39 KB).
- **Documentation**: Table of Contents in README, VS Code Extension section (EN + UK), Marketplace README.

### Changed
- **NPM Isolation**: `src/ui/vscode/**` excluded from NPM tarball via `files` array.
- **TSConfig**: `src/ui/vscode/**` excluded from TypeScript checking (separate build pipeline).
- **Knip**: `src/ui/vscode/**/*` added to ignore list.
- **Full details**: [releases/1/6/v1.6.0/task.md](releases/1/6/v1.6.0/task.md)

## [1.4.1] - 2026-03-25

### Changed
- **Schema-Aware Parsing**: NaN0 format now infers types (e.g., `String` over `Number`) from `Body` static schemas. 
- **Bug Fix**: Fixed top-down comment extraction order for NaN0 objects with 3+ keys.
- **Documentation**: Split README into modular `docs/en` and `docs/uk`, including deep benchmarking vs JSON & YAML.
- **Full details**: [releases/1/4/v1.4.1/task.md](releases/1/4/v1.4.1/task.md)

## [1.4.0] - 2026-03-24

### Added
- **TFunction Contract**: Centralized `createT` export for robust `t(key, vars)` localization.
- **Symmetrical i18n Validation**: Refactored `ModelError` to support `TFunction` injection natively.
- **Full details**: [releases/1/4/v1.4.0/task.md](releases/1/4/v1.4.0/task.md)

## [1.0.0] - 2025-08-04
### Added

- NANO format parser and stringifier for structured data storage
- ContainerObject class for managing nested object hierarchies
- Type conversion utilities (`to`, `typeOf`, `functionOf`)
- Deep merge utility with unique array merging option
- Deep clone utility with circular reference handling
- Validation helpers (`Enum`, `match`, `oneOf`, `empty`, `notEmpty`, `equal`)
- FullObject, UndefinedObject, NonEmptyObject, and ObjectWithAlias classes
- Comprehensive test suite with 82 tests
