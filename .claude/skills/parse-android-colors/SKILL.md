---
name: parse-android-colors
description: Parse Android `colors.xml` resource files and produce a structured list of color tokens (name, hex, alpha, rgb). Use when the user asks to read, parse, audit, convert, or list colors from an Android `res/values*/colors.xml` file, or mentions Android color resources / theme colors in XML form.
---

# Parse Android colors.xml

A helper that reads one or more Android `colors.xml` files and emits a normalised list of color entries.

## When to use

Trigger this skill when the user:

- Asks to "parse / list / dump / audit / convert" colors from an Android resource file.
- Points at a path like `res/values/colors.xml`, `res/values-night/colors.xml`, or any XML containing `<resources><color name="...">#xxxxxx</color></resources>`.
- Wants to extract a design-token table (name → hex / rgba) out of an Android module.

If the XML is **not** Android colors format (e.g. SVG `fill="#..."`, HTML inline styles), do **not** use this skill — fall back to a regex-based extraction instead.

## Input format

Android `colors.xml` looks like:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="brand_primary">#FF5722</color>
    <color name="brand_primary_dark">#E64A19</color>
    <color name="overlay_50">#80000000</color>
    <color name="ref_white">@color/white</color>
</resources>
```

Supported value forms:

| Form        | Example       | Meaning                                  |
|-------------|---------------|------------------------------------------|
| `#RGB`      | `#F0A`        | Short RGB (each digit doubled)           |
| `#ARGB`     | `#8F0A`       | Short ARGB                               |
| `#RRGGBB`   | `#FF5722`     | Standard RGB, alpha defaults to `FF`     |
| `#AARRGGBB` | `#80000000`   | Standard ARGB                            |
| `@color/x`  | `@color/white`| Reference — emit as `ref` (not resolved) |

## How to run

Use the bundled Node script `parse-android-colors.js`. It accepts one or more file paths (or a glob expanded by the shell) and prints JSON to stdout.

```bash
node .claude/skills/parse-android-colors/parse-android-colors.js path/to/colors.xml
node .claude/skills/parse-android-colors/parse-android-colors.js app/src/main/res/values*/colors.xml
```

Flags:

- `--format=json` (default) — JSON array of `{ file, name, raw, hex, alpha, rgb, ref? }`.
- `--format=table` — aligned text table for humans.
- `--format=css` — emit as CSS custom properties (`--brand-primary: #ff5722;`).

## Output schema (JSON)

```json
[
  {
    "file": "app/src/main/res/values/colors.xml",
    "name": "brand_primary",
    "raw": "#FF5722",
    "hex": "#ff5722",
    "alpha": 255,
    "rgb": [255, 87, 34]
  },
  {
    "file": "app/src/main/res/values/colors.xml",
    "name": "overlay_50",
    "raw": "#80000000",
    "hex": "#000000",
    "alpha": 128,
    "rgb": [0, 0, 0]
  },
  {
    "file": "app/src/main/res/values/colors.xml",
    "name": "ref_white",
    "raw": "@color/white",
    "ref": "white"
  }
]
```

## Steps to follow

1. Confirm the target file(s) exist with `ls` or `Glob`.
2. Run the parser script with the file paths.
3. If the user asked for a specific format (CSS variables, Markdown table, etc.), pass the matching `--format` flag or post-process the JSON.
4. Report unresolved `@color/...` references separately so the user knows what was skipped.
