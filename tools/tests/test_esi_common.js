"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "../esi/esi-common.js"), "utf8");

function browser() {
  const context = vm.createContext({ Date, Headers });
  vm.runInContext(script, context);
  return context;
}

test("JSON requests identify the project and preserve options, headers and response", async () => {
  const context = browser();
  const options = { method: "POST", headers: { "Accept-Language": "fr" }, signal: new AbortController().signal };
  const response = { ok: true, json: async () => ({ value: 1 }), headers: { get: () => "header" } };
  context.options = options;
  context.fetch = async (url, receivedOptions) => {
    assert.equal(url, "https://esi.example/test");
    assert.equal(receivedOptions.method, "POST");
    assert.equal(receivedOptions.signal, options.signal);
    assert.equal(receivedOptions.headers.get("Accept-Language"), "fr");
    assert.equal(receivedOptions.headers.get("X-User-Agent"), "https://github.com/DonalChilde/pfmsoft-eve-tools");
    return response;
  };
  const result = await vm.runInContext('requestJson("https://esi.example/test", options)', context);
  assert.equal(result.data.value, 1);
  assert.equal(result.response, response);
  assert.equal(Number.isNaN(Date.parse(result.receivedAt)), false);
  assert.equal(options.headers["X-User-Agent"], undefined);
});

test("requests add the project header with absent, tuple and Headers inputs", async () => {
  const context = browser();
  const seen = [];
  context.fetch = async (url, options) => {
    seen.push(options.headers);
    return { ok: true, json: async () => ({}) };
  };
  context.headers = new Headers({ "content-type": "application/json", "x-user-agent": "old" });
  await vm.runInContext('requestJson("url")', context);
  await vm.runInContext('requestJson("url", {headers: [["X-Compatibility-Date", "2026-08-18"]]})', context);
  await vm.runInContext('requestJson("url", {headers})', context);
  for (const headers of seen) assert.equal(headers.get("x-user-agent"), "https://github.com/DonalChilde/pfmsoft-eve-tools");
  assert.equal(seen[1].get("x-compatibility-date"), "2026-08-18");
  assert.equal(seen[2].get("content-type"), "application/json");
  assert.equal(context.headers.get("x-user-agent"), "old");
});

test("HTTP errors retain each tool's status, retry and body diagnostics", async () => {
  const context = browser();
  let textReads = 0;
  context.fetch = async () => ({
    ok: false, status: 429, statusText: "Too Many Requests",
    headers: { get: () => "60" },
    text: async () => { textReads++; return "  diagnostic \n message  "; },
  });
  for (const [mode, expected] of [
    ["status", "HTTP 429 Too Many Requests"],
    ["retry", "HTTP 429 Too Many Requests; retry after 60"],
    ["body", "HTTP 429 Too Many Requests; retry after 60; diagnostic message"],
  ]) {
    await assert.rejects(vm.runInContext(`requestJson("url", {}, "${mode}")`, context), { message: expected });
  }
  assert.equal(textReads, 1);
  await assert.rejects(vm.runInContext('requestJson("url", {}, "unknown")', context), /Unknown HTTP error detail mode/);
});

test("JSON parse errors are explicit and network errors propagate", async () => {
  const context = browser();
  const syntaxError = vm.runInContext('new SyntaxError("invalid")', context);
  context.fetch = async () => ({ ok: true, json: async () => { throw syntaxError; } });
  await assert.rejects(vm.runInContext('requestJson("url")', context), /ESI returned invalid JSON/);
  const failure = new Error("request aborted");
  context.fetch = async () => { throw failure; };
  await assert.rejects(vm.runInContext('requestJson("url")', context), (error) => error === failure);
});
