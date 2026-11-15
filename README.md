# Pfmsoft Eve Tools

This is a collection of html tools related to Eve Online. The tools are ment to be local files opened in your web browser of choice.

## Copy Paste tools

- Multibuy

## Esi Tools

- Open [ESI tools](tools/esi/index.html) locally to navigate between the tools.
- Fetch or open the schema in the Schema browser; it is shared with both market tools.
  Switching tools preserves their state until the index is reloaded. Applying a new
  schema resets market datasets after any current operation finishes.
- Schema View
- Market Groups with Path
- Market Orders with price summaries (5% buy and sell)

    NOTE: The Eve ESI uses the Last-Modified header to detect if a paged resource has changed during the downloading of the pages. This header is not available when making fetch requests from inside a browser. These tools use Expires as a proxy for the changes detection. Not technically correct, but works in this case.