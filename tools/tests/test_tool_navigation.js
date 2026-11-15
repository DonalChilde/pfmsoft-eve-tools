"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const navigation = fs.readFileSync(path.join(__dirname, "../tool-navigation.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "../copypasta/index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

test("copy-paste navigation keeps a single tool frame alive between pane switches", () => {
  function button(pane) {
    return {
      dataset: { pane }, attributes: {},
      addEventListener(type, handler) { this[type] = handler; },
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
    };
  }
  const home = button("overview");
  const tool = button("multi-buy");
  const card = button("multi-buy");
  const overview = {};
  const panes = { children: [], append(frame) { this.children.push(frame); } };
  const document = {
    getElementById(id) { return id === "overview" ? overview : panes; },
    querySelectorAll(selector) { return selector.startsWith("nav ") ? [home, tool] : [home, tool, card]; },
    createElement() {
      return { setAttribute(name, value) { this[name] = value; } };
    },
  };
  const context = vm.createContext({ document });
  vm.runInContext(navigation, context);
  vm.runInContext(script, context);
  card.click();
  const frame = panes.children[0];
  assert.equal(frame.src, "multi-buy.html");
  assert.equal(frame.title, "EVE multi-buy helper");
  assert.equal(frame.allow, "clipboard-write *");
  assert.equal(overview.hidden, true);
  assert.equal(frame.hidden, false);
  assert.equal(tool.attributes["aria-current"], "page");
  frame.savedState = "inventory";
  home.click();
  assert.equal(overview.hidden, false);
  assert.equal(frame.hidden, true);
  assert.equal(home.attributes["aria-current"], "page");
  tool.click();
  assert.equal(panes.children.length, 1);
  assert.equal(frame.savedState, "inventory");
  assert.equal(frame.hidden, false);
});
