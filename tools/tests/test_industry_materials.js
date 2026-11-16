"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "../copypasta/industry-materials.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function createContext() {
  const elements = new Map();
  const activityRadios = ["Manufacturing", "Invention", "Copying", "Researching ME", "Researching TE"]
    .map((value, index) => ({
      value,
      checked: index === 0,
      listeners: {},
      addEventListener(type, handler) { this.listeners[type] = handler; },
    }));
  const document = {
    getElementById(id) {
      if (!elements.has(id)) {
        const element = {
          value: "",
          hidden: false,
          disabled: false,
          children: [],
          listeners: {},
          addEventListener(type, handler) { this.listeners[type] = handler; },
          replaceChildren() { this.children = []; },
          append(...children) { this.children.push(...children); },
          querySelector(selector) {
            const field = selector.match(/data-field="([^"]+)"/)?.[1];
            return this.children.flatMap((child) => [child, ...(child.children ?? [])])
              .find((child) => child.dataset?.field === field) ?? null;
          },
        };
        elements.set(id, element);
      }
      return elements.get(id);
    },
    createElement() {
      return {
        dataset: {},
        children: [],
        append(...children) { this.children.push(...children); },
        listeners: {},
        addEventListener(type, handler) { this.listeners[type] = handler; },
      };
    },
    querySelectorAll(selector) {
      return selector === 'input[name="activity"]' ? activityRadios : [];
    },
  };
  const context = vm.createContext({ document, navigator: {} });
  vm.runInContext(script, context);
  return { context, elements, activityRadios };
}

test("manufacturing Markdown preserves source quantities and combines them for Multibuy", () => {
  const { context } = createContext();
  context.input = [
    "Armor Command Burst I Blueprint\t43547",
    "",
    "Minerals",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Tritanium\t5\t0\t3.82\t34",
    "",
    "Planetary materials",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Tritanium\t2\t0\t3.82\t34",
  ].join("\n");
  context.activity = "Manufacturing";
  const output = vm.runInContext(`
    const parsed = parseIndustryInput(input, activity);
    buildIndustryMarkdown(parsed, metadataValues(parsed, id => ({me: "10", te: "20", runs: "10", "portion-size": "1"})[id] ?? ""))
  `, context);

  assert.match(output, /## Manufacturing - Armor Command Burst I/);
  assert.match(output, /\| Attribute\s+\| Value\s+\|\n\| -+ \| -+ \|/);
  assert.match(output, /\| Blueprint\s+\| Armor Command Burst I Blueprint 43547\s+\|/);
  assert.match(output, /\| ME\s+\| 10\s+\|\n\| TE\s+\| 20\s+\|/);
  assert.match(output, /\| Time\s+\|\s+\|/);
  assert.doesNotMatch(output, /\| (?:Result|Units)\s+\|/);
  assert.match(output, /### Input\n\nMinerals/);
  assert.match(output, /\| --------- \| -------: \| --------: \| --------------: \| -----: \|/);
  assert.match(output, /\| Tritanium \| 5\s+\| 0\s+\| 3\.82\s+\| 34\s+\|/);
  assert.match(output, /\| Tritanium \| 2\s+\| 0\s+\| 3\.82\s+\| 34\s+\|/);
  assert.match(output, /### Output\n\n\| Name\s+\| Quantity\s+\|\n\| -+ \| -------: \|\n\| Armor Command Burst I \| 10\s+\|/);
  assert.match(output, /### Multibuy\n\n\| Name/);
  assert.match(output, /### Detailed Multibuy\n\n### Detailed Output\n\n### Notes$/);
  assert.match(output, /\| Tritanium \| 7\s+\|/);
});

test("tab-padded blueprint and section headings parse without losing material columns", () => {
  const { context } = createContext();
  context.input = [
    "Prototype Cloaking Device I Blueprint\t13000\t\t\t",
    "",
    "Items\t\t\t\t",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Reports\t5\t0\t31.84\t3814",
    "R.Db - Ishukone\t1\t0\t1062.64\t11463",
    "R.Db - CreoDron\t1\t0\t1279.66\t11466",
    "",
    "Planetary materials\t\t\t\t",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Consumer Electronics\t4\t0\t10142.37\t9836",
  ].join("\n");
  const parsed = vm.runInContext('parseIndustryInput(input, "Researching TE")', context);
  assert.equal(parsed.blueprintName, "Prototype Cloaking Device I Blueprint");
  assert.equal(parsed.blueprintTypeId, "13000");
  assert.deepEqual(Array.from(parsed.sections, (section) => section.name), ["Items", "Planetary materials"]);
  assert.equal(parsed.sections[0].rows.length, 3);
  assert.equal(parsed.sections[1].rows[0].required, "4");
  assert.equal(parsed.sections[1].rows[0].typeId, "9836");
});

test("invention uses the suggested result name and keeps an empty optional-items table", () => {
  const { context } = createContext();
  context.input = [
    "Armor Command Burst I Blueprint\t43547",
    "Datacores",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Datacore - Nuclear Physics\t6\t0\t90968.85\t20423",
    "Optional items",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "No item selected\t\t\t\t",
  ].join("\n");
  context.activity = "Invention";
  const output = vm.runInContext(`
    const parsed = parseIndustryInput(input, activity);
    const fields = {runs: "3", me: "2", te: "4", "result-runs": "10", "result-name": defaultInventionResult(parsed.blueprintName)};
    buildIndustryMarkdown(parsed, metadataValues(parsed, id => fields[id] ?? ""))
  `, context);

  assert.doesNotMatch(output, /\| Result\s+\|/);
  assert.match(output, /\| ME\s+\| 2\s+\|\n\| TE\s+\| 4\s+\|\n\| Result Runs\s+\| 10\s+\|/);
  assert.match(output, /\| Time\s+\|\s+\|/);
  assert.match(output, /Optional items\n\n\| Item \| Required \| Available \| Est\. Unit price \| typeID \|\n\| ---- \| -------: \| --------: \| --------------: \| -----: \|/);
  assert.match(output, /### Output\n\n\| Name[\s\S]*?\n\| Armor Command Burst II Blueprint \| \s+\|/);
  assert.match(output, /### Multibuy\n\n\| Name[\s\S]*?\n\| -+ \| -------: \|/);
  assert.match(output, /\| Datacore - Nuclear Physics \| 6\s+\|/);
});

test("copying and research outputs include Time and retain activity-specific fields", () => {
  const { context } = createContext();
  for (const activity of ["Copying", "Researching ME", "Researching TE"]) {
    context.activity = activity;
    const parsed = vm.runInContext(`
      parseIndustryInput("Prototype Cloaking Device I Blueprint\\t13000", activity)
    `, context);
    assert.equal(parsed.activity, activity);
  }
  const copyingOutput = vm.runInContext(`
      (() => {
        const parsed = parseIndustryInput("Prototype Cloaking Device I Blueprint\\t13000", "Copying");
        return buildIndustryMarkdown(parsed, metadataValues(parsed, id => ({runs: "1", "runs-per-copy": "10"})[id] ?? ""));
      })()
    `, context);
  assert.match(copyingOutput, /\| Runs\s+\| 1\s+\|\n\| Runs per copy\s+\| 10\s+\|\n\| Time\s+\|\s+\|/);
  assert.match(copyingOutput, /### Output\n\n\| Name[\s\S]*?\| Prototype Cloaking Device I Blueprint \| \s+\|/);
  const researchOutput = vm.runInContext(`
      (() => {
        const parsed = parseIndustryInput("Prototype Cloaking Device I Blueprint\\t13000\\nItems\\nItem\\tRequired\\tAvailable\\tEst. Unit price\\ttypeID\\nReports\\t5\\t0\\t31.84\\t3814", "Researching ME");
        return buildIndustryMarkdown(parsed, metadataValues(parsed, () => ""));
      })()
  `, context);
  assert.match(researchOutput, /## Researching ME - Prototype Cloaking Device I/);
  assert.match(researchOutput, /\| Reports \| 5\s+\|/);
  assert.match(researchOutput, /\| Time\s+\|\s+\|/);
  assert.match(researchOutput, /### Multibuy/);
  assert.match(researchOutput, /### Detailed Multibuy\n\n### Detailed Output\n\n### Notes$/);
  assert.doesNotMatch(researchOutput, /\| (?:Runs|Result)\s+\|/);
  assert.match(researchOutput, /\| Activity\s+\| Researching ME\s+\|/);
});

test("invalid activity selection and malformed quantities produce clear errors", () => {
  const { context } = createContext();
  assert.throws(
    () => vm.runInContext('parseIndustryInput("Blueprint I\\t1", "Unknown")', context),
    /Select a valid Industry activity/,
  );
  assert.throws(
    () => vm.runInContext('parseIndustryInput("Blueprint I\\t1\\nMinerals\\nItem\\tRequired\\tAvailable\\tEst. Unit price\\ttypeID\\nTritanium\\tnope\\t0\\t3.82\\t34", "Manufacturing")', context),
    /Line 4: Required quantity must be a whole number/,
  );
  assert.throws(
    () => vm.runInContext('parseIndustryInput("Blueprint I\\t1\\nMinerals\\nItem\\tRequired\\tAvailable\\tEst. Unit price\\ttypeID\\nTritanium 5 0 3.82 34", "Manufacturing")', context),
    /Line 4: Section name must be followed by a material table header/,
  );
});

test("Researching ME generates Markdown on parse without activity inputs", () => {
  const { elements, activityRadios } = createContext();
  activityRadios[0].checked = false;
  activityRadios[3].checked = true;
  activityRadios[3].listeners.change();
  elements.get("industry-input").value = [
    "Prototype Cloaking Device I Blueprint\t13000",
    "Items",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Reports\t5\t0\t31.84\t3814",
  ].join("\n");
  elements.get("parse-button").listeners.click();

  assert.match(elements.get("markdown-output").value, /## Researching ME/);
  assert.match(elements.get("markdown-output").value, /\| Time\s+\|\s+\|/);
  assert.equal(elements.get("time-warning").hidden, false);
  assert.equal(elements.get("copy-button").disabled, false);
});

test("Manufacturing defaults Portion Size to one and validates user-provided Runs", () => {
  const { elements } = createContext();
  elements.get("industry-input").value = [
    "Armor Command Burst I Blueprint\t43547",
    "Minerals",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Tritanium\t8541\t0\t3.82\t34",
  ].join("\n");
  elements.get("parse-button").listeners.click();

  const fields = elements.get("metadata-fields");
  assert.equal(fields.querySelector('[data-field="portion-size"]').value, "1");
  assert.equal(elements.get("time-warning").hidden, false);
  fields.querySelector('[data-field="me"]').value = "10";
  fields.querySelector('[data-field="te"]').value = "20";
  const runs = fields.querySelector('[data-field="runs"]');
  runs.value = "10";
  runs.listeners.input();
  elements.get("generate-button").listeners.click();
  assert.match(elements.get("markdown-output").value, /\| Armor Command Burst I\s+\| 10\s+\|/);
  assert.match(elements.get("markdown-output").value, /\| Time\s+\|\s+\|/);

  const time = fields.querySelector('[data-field="time"]');
  time.value = "1h 2m";
  time.listeners.input();
  assert.equal(elements.get("time-warning").hidden, true);
  elements.get("generate-button").listeners.click();
  assert.match(elements.get("markdown-output").value, /\| Time\s+\| 1h 2m\s+\|/);

  runs.value = "1.5";
  runs.listeners.input();
  assert.equal(elements.get("copy-button").disabled, true);
  elements.get("generate-button").listeners.click();
  assert.equal(elements.get("markdown-output").value, "");
  assert.match(elements.get("metadata-error").textContent, /Runs must be a whole number/);
});

test("activity radios are ordered with Manufacturing default and drive output fields", () => {
  const { context, elements, activityRadios } = createContext();
  assert.match(html, /value="Researching ME"> ME<\/label>/);
  assert.match(html, /value="Researching TE"> TE<\/label>/);
  assert.deepEqual(activityRadios.map((radio) => radio.value), [
    "Manufacturing",
    "Invention",
    "Copying",
    "Researching ME",
    "Researching TE",
  ]);
  assert.equal(activityRadios[0].checked, true);
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="portion-size"]').value, "1");

  activityRadios[0].checked = false;
  activityRadios[1].checked = true;
  activityRadios[1].listeners.change();
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="me"]').value, "2");
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="te"]').value, "4");
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="result-runs"]').value, "10");
  assert.equal(elements.get("invention-note").hidden, false);

  elements.get("industry-input").value = [
    "Armor Command Burst I Blueprint\t43547",
    "Items",
    "Item\tRequired\tAvailable\tEst. Unit price\ttypeID",
    "Reports\t5\t0\t31.84\t3814",
  ].join("\n");
  elements.get("parse-button").listeners.click();
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="result-name"]').value, "Armor Command Burst II");
  elements.get("metadata-fields").querySelector('[data-field="runs"]').value = "3";
  elements.get("generate-button").listeners.click();
  assert.match(elements.get("markdown-output").value, /## Invention - Armor Command Burst I/);
  assert.match(elements.get("markdown-output").value, /\| Activity\s+\| Invention\s+\|/);
  assert.equal(vm.runInContext("parsedInput.activity", context), "Invention");
});

test("Reset clears input and Markdown and restores the default activity", () => {
  const { context, elements, activityRadios } = createContext();
  activityRadios[0].checked = false;
  activityRadios[1].checked = true;
  activityRadios[1].listeners.change();
  elements.get("industry-input").value = "Armor Command Burst I Blueprint\t43547";
  elements.get("parse-button").listeners.click();
  elements.get("metadata-fields").querySelector('[data-field="runs"]').value = "3";
  elements.get("generate-button").listeners.click();
  assert.notEqual(elements.get("markdown-output").value, "");
  assert.equal(elements.get("copy-button").disabled, false);

  elements.get("metadata-error").textContent = "Old error";
  elements.get("metadata-error").hidden = false;
  elements.get("reset-button").listeners.click();

  assert.equal(elements.get("industry-input").value, "");
  assert.equal(elements.get("markdown-output").value, "");
  assert.equal(elements.get("copy-button").disabled, true);
  assert.equal(elements.get("status").textContent, "");
  assert.equal(elements.get("input-error").hidden, true);
  assert.equal(elements.get("metadata-error").hidden, true);
  assert.equal(elements.get("metadata-error").textContent, "");
  assert.deepEqual(activityRadios.map((radio) => radio.checked), [true, false, false, false, false]);
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="portion-size"]').value, "1");
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="me"]').value, "");
  assert.equal(elements.get("metadata-fields").querySelector('[data-field="time"]').value, "");
  assert.equal(elements.get("time-warning").hidden, false);
  assert.equal(elements.get("invention-note").hidden, true);
  assert.equal(vm.runInContext("parsedInput", context), null);
});
