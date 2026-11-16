"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "../copypasta/multi-buy.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const exportTextStart = script.indexOf("    function exportText(");
const exportTextEnd = script.indexOf("\n    function showManualCopy", exportTextStart);
const exportTextSource = script.slice(exportTextStart, exportTextEnd);
const inventoryColumns = [
  "Name", "Quantity", "Group", "Category", "Size", "Slot",
  "Volume", "Meta Level", "Tech Level", "Est. Price",
];

function exportMarkdown(items, longForm, itemValues) {
  return vm.runInNewContext(
    `${exportTextSource}\nexportText(items, new Map(), longForm, true);`,
    {
      inventoryColumns,
      items,
      longForm,
      itemValues,
      stackTotal: (_items, _metadata, _field, unit) => `1.00 ${unit}`,
    },
  );
}

function rightAlignedColumns(markdown) {
  return markdown.split("\n")[1]
    .split("|")
    .filter((cell) => cell.trim())
    .map((cell) => cell.trim().endsWith(":"));
}

test("short Markdown right-aligns the numeric Quantity column", () => {
  const markdown = exportMarkdown(
    new Map([["Tritanium", 1000n]]),
    false,
    (name, quantity) => [name, quantity.toLocaleString("en-US")],
  );

  assert.deepEqual(rightAlignedColumns(markdown), [false, true]);
});

test("long Markdown right-aligns numeric columns and leaves text columns left-aligned", () => {
  const markdown = exportMarkdown(
    new Map([["Tritanium", 1000n], ["Pyerite", 250n]]),
    true,
    (name, quantity) => [
      name,
      quantity.toLocaleString("en-US"),
      "Minerals",
      "Ore",
      "1.00 m3",
      "High",
      "12.50 m3",
      "3",
      "2",
      "1,234.50 ISK",
    ],
  );

  assert.deepEqual(rightAlignedColumns(markdown), [
    false, true, false, false, true, false, true, true, true, true,
  ]);
});
