"use strict";

// Classic script so the tools also work when opened directly with file://.
// Each pane has its own JavaScript context; schema state is shared by the index.
const ESI_ORIGIN = "https://esi.evetech.net";
const ESI_USER_AGENT = "https://github.com/DonalChilde/pfmsoft-eve-tools";

/** Return whether a value is a non-null, non-array object. */
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Validate an actual calendar date in YYYY-MM-DD format. */
function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

/** Validate an ISO timestamp with an explicit UTC offset. */
function isTimestamp(value) {
  return typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    isDate(value.slice(0, 10)) && !Number.isNaN(Date.parse(value));
}

/** Validate a positive integer that JavaScript can represent exactly. */
function positiveId(value) {
  return Number.isSafeInteger(value) && value > 0;
}

/** Update an existing live status element and its success/error styling. */
function setStatus(id, message, error = false) {
  const element = document.getElementById(id);
  element.textContent = message;
  element.className = `status ${error ? "error" : "success"}`;
}

/**
 * Fetch and parse JSON. Request options (including headers, method and signal)
 * are passed through to fetch, with X-User-Agent identifying this project.
 * Returns the data, original response for header inspection, and the UTC time
 * at which JSON parsing completed.
 *
 * errorDetail selects the existing caller-specific HTTP diagnostics: "status"
 * reports only status, "retry" also reports Retry-After, and "body" additionally
 * includes up to 500 characters of response text. Network and abort failures
 * propagate unchanged; invalid JSON is reported explicitly.
 */
async function requestJson(url, options = {}, errorDetail = "retry") {
  if (!["status", "retry", "body"].includes(errorDetail)) throw new Error(`Unknown HTTP error detail mode: ${errorDetail}`);
  const headers = new Headers(options.headers);
  headers.set("X-User-Agent", ESI_USER_AGENT);
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const retry = errorDetail === "status" ? null : response.headers.get("Retry-After");
    const detail = errorDetail === "body" ? (await response.text()).trim().replace(/\s+/g, " ").slice(0, 500) : "";
    throw new Error(`HTTP ${response.status} ${response.statusText}${retry ? `; retry after ${retry}` : ""}${detail ? `; ${detail}` : ""}`.trim());
  }
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error("ESI returned invalid JSON.");
    throw error;
  }
  return { data, response, receivedAt: new Date().toISOString() };
}

/** Create the ESI compatibility and language headers used by market requests. */
function requestHeaders(schema, language) {
  return { "X-Compatibility-Date": schema.compatibilityDate, "Accept-Language": language };
}

/**
 * Resolve internal OpenAPI path-item references, preserving sibling fields.
 * Reject external, malformed, missing, non-object, and cyclic targets.
 */
function resolvePathItem(root, item) {
  const seen = new Set();
  while (isObject(item) && Object.hasOwn(item, "$ref")) {
    const ref = item.$ref;
    if (typeof ref !== "string" || !ref.startsWith("#/")) throw new Error(`Unsupported schema path reference: ${String(ref)}`);
    if (seen.has(ref)) throw new Error(`Cyclic schema path reference: ${ref}`);
    seen.add(ref);
    let pointer;
    try {
      pointer = decodeURIComponent(ref.slice(2));
    } catch {
      throw new Error(`Invalid schema path reference: ${ref}`);
    }
    let target = root;
    for (const token of pointer.split("/")) {
      if (/~(?![01])/.test(token)) throw new Error(`Invalid schema path reference: ${ref}`);
      const key = token.replace(/~1/g, "/").replace(/~0/g, "~");
      if ((!isObject(target) && !Array.isArray(target)) || !Object.hasOwn(target, key)) {
        throw new Error(`Missing schema path reference: ${ref}`);
      }
      target = target[key];
    }
    if (!isObject(target)) throw new Error(`Invalid schema path target: ${ref}`);
    item = { ...target, ...Object.fromEntries(Object.entries(item).filter(([key]) => key !== "$ref")) };
  }
  return item;
}

/**
 * Validate the shared raw or dereferenced OpenAPI document for market tools.
 * A dereferenced wrapper supplies its own receipt timestamp, including null.
 */
function readMarketSchema(input, timestamp) {
  let schema = input;
  if (isObject(input) && Object.hasOwn(input, "dereferenced_schema")) {
    if (!Object.hasOwn(input, "timestamp") || (input.timestamp !== null && !isTimestamp(input.timestamp))) {
      throw new Error("The schema timestamp must be an ISO timestamp or null.");
    }
    schema = input.dereferenced_schema;
    timestamp = input.timestamp;
  }
  if (!isObject(schema) || typeof schema.openapi !== "string" ||
      !isObject(schema.info) || !isObject(schema.paths) || !isObject(schema.components)) {
    throw new Error("Expected an OpenAPI object with openapi, info, paths, and components.");
  }
  const compatibilityDate = schema.info.version;
  if (!isDate(compatibilityDate)) throw new Error("Schema info.version must contain a valid compatibility date.");
  return { schema, timestamp, compatibilityDate };
}

/** Restrict schema paths to relative paths on the ESI origin. */
function isSafePath(path) {
  return typeof path === "string" && /^\/(?!\/)[^?#\\]*$/.test(path);
}

/** Check the envelope sent by the ESI index before a tool parses its schema. */
function isSharedSchemaMessage(data) {
  return isObject(data) && data.type === "esi-schema-shared" && isObject(data.document) &&
    typeof data.source === "string" && (data.timestamp === null || isTimestamp(data.timestamp));
}

/** Download formatted JSON and release the temporary object URL afterward. */
function downloadJson(value, filename) {
  const blob = new Blob([JSON.stringify(value, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
