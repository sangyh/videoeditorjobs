import { copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

await copyFile(join(root, "docs", "google-sheets-apps-script.js"), join(root, "apps-script", "Code.js"));

console.log("Synced docs/google-sheets-apps-script.js to apps-script/Code.js");
