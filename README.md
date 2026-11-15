# Pfmsoft Eve Tools

This is a collection of html tools related to Eve Online. The tools are ment to be local files opened in your web browser of choice.

## Copy Paste tools

- Open [Copy Paste tools](tools/copypasta/index.html) locally to navigate between tools.
  Switching panes preserves tool state until the index is reloaded.
- [Multi-buy](tools/copypasta/multi-buy.html)
- [Industry Materials](tools/copypasta/industry-materials.html): convert copied Industry material lists to Markdown, including a combined Multibuy table.

## Esi Tools

- Open [ESI tools](tools/esi/index.html) locally to navigate between the tools.
- Fetch or open the schema in the Schema browser; it is shared with both market tools.
  Switching tools preserves their state until the index is reloaded. Applying a new
  schema resets market datasets after any current operation finishes.
- Keep [esi-common.js](tools/esi/esi-common.js) alongside the ESI HTML files. It
  provides their shared network, schema validation, status, and JSON download helpers;
  no server or build is required.
- ESI requests identify this project using the `X-User-Agent` header.
- Both tool indexes use [tool-navigation.js](tools/tool-navigation.js) and
  [tool-navigation.css](tools/tool-navigation.css) for their shared navigation.
- Schema View
- Market Groups with Path
- Market Orders with price summaries (5% buy and sell)

    NOTE: The Eve ESI uses the Last-Modified header to detect if a paged resource has changed during the downloading of the pages. This header is not available when making fetch requests from inside a browser. These tools use Expires as a proxy for the changes detection. Not technically correct, but works in this case.