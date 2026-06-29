import { writeFile } from "node:fs/promises";
import { loadLocalEnv, validateIntakeEndpoint } from "./env.mjs";

await loadLocalEnv();

const args = process.argv.slice(2);
const checkOnly = args.includes("--check-only");
const endpoint = args.find((arg) => !arg.startsWith("--")) || process.env.VEJ_INTAKE_ENDPOINT || "";
const validation = validateIntakeEndpoint(endpoint);

if (!validation.ok) {
  console.error(`Invalid VEJ_INTAKE_ENDPOINT: ${validation.reason}`);
  console.error("Usage: npm run configure:endpoint -- https://script.google.com/macros/s/DEPLOYMENT_ID/exec");
  process.exit(1);
}

if (!checkOnly) {
  await writeFile(
    new URL("../.env.local", import.meta.url),
    [
      "# Local-only Video Editor Jobs settings. Do not commit real endpoint values.",
      `VEJ_INTAKE_ENDPOINT=${endpoint}`,
      "",
    ].join("\n")
  );
}

console.log(
  JSON.stringify(
    {
      ok: true,
      endpoint,
      wroteEnvLocal: !checkOnly,
      nextCommands: [
        "npm run smoke:intake",
        "npm run launch:ready -- --require-endpoint",
        "npm run smoke:live -- https://videoeditorjobs.com --require-endpoint",
      ],
      vercelEnvironment: {
        VEJ_INTAKE_ENDPOINT: endpoint,
      },
    },
    null,
    2
  )
);
