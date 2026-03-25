# NaN0 Data Format

**NaN0** is a minimal, human-readable serialization format designed for typed data. It balances the human-friendliness of YAML/Markdown with the parsing efficiency needed for performance-critical JS applications.

## General Rules

- **Indentation-based**: Uses two-space indentation to define nesting.
- **Top-level**: Can be an object (key-value) or an array.
- **Comments**: Start with `#`. Multi-line comments are supported via indentation.
- **Empty containers**: Represented as `{}` (object) and `[]` (array).

## Performance (Benchmark)

NaN0 was designed to significantly outperform YAML and standard Markdown while remaining more compact than JSON. Tested with ~21.8 kB payload (10,000 iterations):

| Format    | Size (rel.) | Parse Speed (vs JSON) | Use Case |
|-----------|-------------|-----------------------|----------|
| **JSON**  | 100%        | **1.0x**              | Machine-to-machine |
| **NaN0**  | 101.1%      | **5.3x - 5.5x**       | Data-driven Logic, Configs |
| **MD+N0** | 110.4%      | **5.0x - 5.1x**       | Articles with Metadata |
| **YAML**  | 105.7%      | **55.0x - 60.0x**     | Legacy Configs |

*MD+N0 uses NaN0 for frontmatter instead of YAML, resulting in a **12x speedup** for Markdown parsing.*

---

## Type System

| Type | Syntax | Result |
|------|--------|--------|
| **String** | `key: text` | JS String |
| **Multiline** | `key: \|` | Indented lines preserved |
| **Number** | `key: 1_234.5` | JS Number (supports underscores) |
| **Boolean** | `key: true` | JS Boolean |
| **Date** | `key: 2024-11-13` | JS Date |
| **Null** | `key: null` | JS null |

---

## Schema-Aware Parsing

The parser can infer types from static metadata of a provided `Body` class.

```javascript
class User {
  static age = { type: String } // Forces "30" instead of 30
}

const data = NaN0.parse('age: 30', { Body: User })
```

### Methods

- `NaN0.parse(text, context?)`: Converts NaN0 string to JS object.
- `NaN0.stringify(obj, context?)`: Converts JS object to NaN0 string.
- `context.comments`: An array where extracted comments are stored.
