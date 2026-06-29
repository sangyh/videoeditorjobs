import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const spreadsheetId = "19Hx9jc-cMI2yjYAzSG5NVca8yABCTLygomKs59CuTXI";
const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
const root = new URL("../", import.meta.url);

async function readRoot(path) {
  return readFile(new URL(path, root), "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function runNodeScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: root.pathname,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    fail(output || `${scriptPath} failed`);
  }

  return result.stdout.trim();
}

const [script, projectScript, manifestText] = await Promise.all([
  readRoot("docs/google-sheets-apps-script.js"),
  readRoot("apps-script/Code.js"),
  readRoot("apps-script/appsscript.json"),
]);

if (script !== projectScript) {
  fail("apps-script/Code.js is out of sync. Run npm run sync:apps-script first.");
}

if (!script.includes(`spreadsheetId: "${spreadsheetId}"`)) {
  fail(`Apps Script is not configured for expected spreadsheet id ${spreadsheetId}`);
}

const manifest = JSON.parse(manifestText);
if (manifest.webapp?.access !== "ANYONE_ANONYMOUS") {
  fail("Apps Script manifest must use webapp.access = ANYONE_ANONYMOUS.");
}

if (manifest.webapp?.executeAs !== "USER_DEPLOYING") {
  fail("Apps Script manifest must use webapp.executeAs = USER_DEPLOYING.");
}

const contractOutput = runNodeScript("scripts/verify-apps-script-contract.mjs");
const contract = JSON.parse(contractOutput);

console.log(
  JSON.stringify(
    {
      ok: true,
      spreadsheetUrl,
      scriptSource: "docs/google-sheets-apps-script.js",
      projectSource: "apps-script/",
      manifest: {
        runtimeVersion: manifest.runtimeVersion,
        access: manifest.webapp.access,
        executeAs: manifest.webapp.executeAs,
      },
      contract,
      googleSheetsSteps: [
        "Open the spreadsheet URL.",
        "Go to Extensions > Apps Script.",
        "Paste docs/google-sheets-apps-script.js into Code.gs, or push apps-script/ with clasp if you have clasp configured.",
        "Save, then run setup() and approve Sheets/send-email permissions.",
        "Run seedCommunityPosts().",
        `Run launchHealthCheck() and confirm ok: true and scriptVersion: ${contract.scriptVersion}.`,
        "Run testSubmission() and confirm one editor row, one hiring row, and at least one proposed match row appear.",
        "Run cleanupTestSubmissions() after verification to remove only generated test rows and test matches.",
        "Run suggestMatches() later whenever new editor and hiring rows need proposed matches.",
        "Deploy > New deployment > Web app.",
        "Set Execute as: Me.",
        "Set Who has access: Anyone.",
        "Copy the Web app URL ending in /exec.",
      ],
      afterExecUrlExists: [
        "npm run configure:endpoint -- \"https://script.google.com/macros/s/DEPLOYMENT_ID/exec\"",
        "npm run launch:ready -- --require-endpoint",
        "npm run smoke:intake",
        "Add VEJ_INTAKE_ENDPOINT to Vercel production env and redeploy.",
        "npm run smoke:live -- https://videoeditorjobs.com --require-endpoint",
      ],
    },
    null,
    2
  )
);
