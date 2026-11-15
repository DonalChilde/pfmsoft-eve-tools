"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "../esi/index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const commonScript = fs.readFileSync(path.join(__dirname, "../esi/esi-common.js"), "utf8");
const navigationScript = fs.readFileSync(path.join(__dirname, "../tool-navigation.js"), "utf8");

test("the index relays schema browser updates to ready and later-opened market panes", () => {
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { append() {} });
      return elements.get(id);
    },
    createElement() {
      return { contentWindow: { messages: [], postMessage(message) { this.messages.push(message); } } };
    },
    querySelectorAll() { return []; },
  };
  const window = { addEventListener(type, handler) { this[type] = handler; } };
  const c = vm.createContext({ document, window });
  vm.runInContext(commonScript, c);
  vm.runInContext(navigationScript, c);
  vm.runInContext(script, c);
  vm.runInContext('showPane("esi-schema"); showPane("market-groups")', c);
  const schema = vm.runInContext('frames.get("esi-schema").contentWindow', c);
  const groups = vm.runInContext('frames.get("market-groups").contentWindow', c);
  const payload = { type: "esi-schema-loaded", document: { info: {} }, source: "file", timestamp: null };
  window.message({ source: groups, data: payload });
  assert.equal(vm.runInContext("state.sharedSchema", c), null);
  window.message({ source: schema, data: payload });
  assert.equal(groups.messages.length, 0);
  window.message({ source: groups, data: { type: "esi-tool-ready" } });
  assert.equal(groups.messages.length, 1);
  assert.equal(groups.messages[0].document, payload.document);
  assert.equal(groups.messages[0].type, "esi-schema-shared");
  vm.runInContext('showPane("market-orders")', c);
  const orders = vm.runInContext('frames.get("market-orders").contentWindow', c);
  window.message({ source: orders, data: { type: "esi-tool-ready" } });
  assert.equal(orders.messages[0].source, "file");
  window.message({ source: schema, data: { ...payload, source: "replacement" } });
  assert.equal(groups.messages[1].source, "replacement");
  assert.equal(orders.messages[1].source, "replacement");
  vm.runInContext('showPane("market-groups")', c);
  assert.equal(vm.runInContext('frames.get("market-groups").contentWindow', c), groups);
});
