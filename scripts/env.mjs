import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const endpointPattern = /^https:\/\/script\.google\.com\/macros\/s\/[^/\s]+\/exec$/;

export const expectedScriptVersion = "vej-2026-07-14-public-jobs-200";
export const defaultIntakeEndpoint =
  "https://script.google.com/macros/s/AKfycbwdyh29V8B0xaZ58J0-neqUcrQg2ognel8nWT1XcVYjuB0dWOefnhYyRhk19r1hijdJ7A/exec";

function unquote(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export async function loadLocalEnv(files = [".env.local"]) {
  const loaded = {};

  for (const file of files) {
    let text;
    try {
      text = await readFile(new URL(file, root), "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        continue;
      }
      throw error;
    }

    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = unquote(line.slice(separatorIndex + 1));
      if (!key || process.env[key] !== undefined) {
        continue;
      }

      process.env[key] = value;
      loaded[key] = value;
    }
  }

  return loaded;
}

export function validateIntakeEndpoint(endpoint) {
  if (!endpoint) {
    return { ok: false, reason: "missing endpoint" };
  }

  if (endpoint.includes("DEPLOYMENT_ID")) {
    return { ok: false, reason: "endpoint still contains DEPLOYMENT_ID placeholder" };
  }

  if (!endpointPattern.test(endpoint)) {
    return { ok: false, reason: "endpoint must be a script.google.com /macros/s/.../exec URL" };
  }

  return { ok: true };
}
