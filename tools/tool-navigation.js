"use strict";

/**
 * Connect an index's data-pane buttons to an overview and lazy-loaded tool
 * frames. Frames remain mounted when hidden so their in-memory state survives.
 * Each tool supplies a relative src, accessible title, and optional iframe
 * allow policy. The returned frames map can also be used for pane messaging.
 */
function initializeToolNavigation(tools) {
  const frames = new Map();
  const overview = document.getElementById("overview");
  const panes = document.getElementById("panes");

  function showPane(paneId) {
    if (paneId !== "overview" && !Object.hasOwn(tools, paneId)) {
      throw new Error(`Unknown tool pane: ${paneId}`);
    }
    if (paneId !== "overview" && !frames.has(paneId)) {
      const tool = tools[paneId];
      const frame = document.createElement("iframe");
      frame.src = tool.src;
      frame.title = tool.title;
      if (tool.allow) frame.setAttribute("allow", tool.allow);
      frame.hidden = true;
      panes.append(frame);
      frames.set(paneId, frame);
    }
    overview.hidden = paneId !== "overview";
    for (const [frameId, frame] of frames) frame.hidden = frameId !== paneId;
    for (const button of document.querySelectorAll("nav button[data-pane]")) {
      if (button.dataset.pane === paneId) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  }

  for (const button of document.querySelectorAll("button[data-pane]")) {
    button.addEventListener("click", () => showPane(button.dataset.pane));
  }
  return { frames, showPane };
}
