#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const files = [];
let format = "json";

for (const arg of args) {
  if (arg.startsWith("--format=")) {
    format = arg.slice("--format=".length);
  } else if (arg === "-h" || arg === "--help") {
    printHelp();
    process.exit(0);
  } else {
    files.push(arg);
  }
}

if (files.length === 0) {
  printHelp();
  process.exit(1);
}

const COLOR_TAG = /<color\s+name="([^"]+)"\s*>([^<]+)<\/color>/g;

function parseColorValue(raw) {
  const value = raw.trim();
  if (value.startsWith("@")) {
    return { ref: value.replace(/^@color\//, "") };
  }
  const m = /^#([0-9a-fA-F]+)$/.exec(value);
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  } else if (hex.length === 4) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  let alpha = 255;
  let rgbHex = hex;
  if (hex.length === 8) {
    alpha = parseInt(hex.slice(0, 2), 16);
    rgbHex = hex.slice(2);
  } else if (hex.length !== 6) {
    return null;
  }
  const r = parseInt(rgbHex.slice(0, 2), 16);
  const g = parseInt(rgbHex.slice(2, 4), 16);
  const b = parseInt(rgbHex.slice(4, 6), 16);
  return {
    hex: "#" + rgbHex.toLowerCase(),
    alpha,
    rgb: [r, g, b],
  };
}

const entries = [];

for (const file of files) {
  let xml;
  try {
    xml = fs.readFileSync(file, "utf8");
  } catch (err) {
    process.stderr.write(`error: cannot read ${file}: ${err.message}\n`);
    process.exitCode = 1;
    continue;
  }
  let match;
  while ((match = COLOR_TAG.exec(xml)) !== null) {
    const [, name, raw] = match;
    const parsed = parseColorValue(raw);
    if (!parsed) {
      entries.push({ file, name, raw: raw.trim(), error: "unrecognised color value" });
      continue;
    }
    entries.push({ file, name, raw: raw.trim(), ...parsed });
  }
}

if (format === "json") {
  process.stdout.write(JSON.stringify(entries, null, 2) + "\n");
} else if (format === "table") {
  const rows = entries.map((e) => [
    path.basename(e.file),
    e.name,
    e.ref ? "→ " + e.ref : e.hex || e.raw,
    e.alpha != null ? String(e.alpha) : "",
    e.rgb ? `rgb(${e.rgb.join(",")})` : "",
  ]);
  const headers = ["file", "name", "hex/ref", "alpha", "rgb"];
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] || "").length))
  );
  const fmt = (row) =>
    row.map((cell, i) => (cell || "").padEnd(widths[i])).join("  ");
  process.stdout.write(fmt(headers) + "\n");
  process.stdout.write(widths.map((w) => "-".repeat(w)).join("  ") + "\n");
  for (const r of rows) process.stdout.write(fmt(r) + "\n");
} else if (format === "css") {
  process.stdout.write(":root {\n");
  for (const e of entries) {
    if (e.ref) {
      process.stdout.write(`  --${kebab(e.name)}: var(--${kebab(e.ref)});\n`);
    } else if (e.hex) {
      const value = e.alpha === 255
        ? e.hex
        : `rgba(${e.rgb.join(",")},${(e.alpha / 255).toFixed(3)})`;
      process.stdout.write(`  --${kebab(e.name)}: ${value};\n`);
    }
  }
  process.stdout.write("}\n");
} else {
  process.stderr.write(`error: unknown --format=${format}\n`);
  process.exit(2);
}

function kebab(s) {
  return s.replace(/_/g, "-").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function printHelp() {
  process.stdout.write(
    `Usage: parse-android-colors.js [--format=json|table|css] <colors.xml> [...]\n`
  );
}
