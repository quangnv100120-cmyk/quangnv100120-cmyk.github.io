---
description: Update mapping from Figma exported JSON variables
---
This workflow automatically syncs the user's exported `Localization.json` from Figma into the correct `vi.json` and `en.json` dictionaries and updates any newly discovered mapped classes if requested.

When the user specifies they have a new `Localization.json` file exported from Figma, run this workflow:

1. Confirm the absolute path to `Localization.json` (usually `/Users/quangnguyen/Desktop/Localization.json` or uploaded in chat).
// turbo
2. Run `node parse_localization.js` in the `Vibe coding` workspace directory. This will parse the JSON into `locales/vi.json` and `locales/en.json`.
3. Inform the user that the translation files have been updated successfully and they should reload Live Server (Cmd + Shift + R) to see the new content!
