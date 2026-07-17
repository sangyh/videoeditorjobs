const fallbackRecipient = "sangy@rightjoin.co";
const config = window.VEJ_CONFIG || {};
const draftStoragePrefix = "vej:intake-draft:";
const trackingStoragePrefix = "vej:tracking:";
const consentText =
  "I agree to be contacted about video editor jobs, hiring matches, and community updates, and I accept the terms and privacy policy.";
const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"];
const draftFieldNames = [
  "name",
  "email",
  "location",
  "company",
  "primary_fit",
  "role_type",
  "portfolio_url",
  "experience_level",
  "work_preference",
  "rate_range",
  "weekly_capacity",
  "budget",
  "timeline",
  "content_format",
  "project_scope",
  "deliverables",
  "footage_volume",
  "software",
  "turnaround_time",
  "availability",
  "revision_process",
  "reference_urls",
  "notes",
  "brief",
];

function getEndpoint() {
  return String(config.intakeEndpoint || "").trim();
}

function getTrackingParams() {
  const current = trackingFromUrl();
  if (hasTracking(current)) return current;

  return readStoredTracking("latest") || readStoredTracking("first") || current;
}

function trackingFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(trackingKeys.map((key) => [key, params.get(key) || ""]));
}

function hasTracking(values) {
  return Object.values(values || {}).some((value) => String(value || "").trim());
}

function trackingStorageKey(kind) {
  return `${trackingStoragePrefix}${kind}`;
}

function readStoredTracking(kind) {
  if (!storageAvailable()) return null;
  try {
    const stored = JSON.parse(window.localStorage.getItem(trackingStorageKey(kind)) || "null");
    if (!stored?.tracking || !hasTracking(stored.tracking)) return null;
    return stored.tracking;
  } catch {
    return null;
  }
}

function writeStoredTracking(kind, tracking) {
  if (!storageAvailable() || !hasTracking(tracking)) return;
  window.localStorage.setItem(
    trackingStorageKey(kind),
    JSON.stringify({
      tracking,
      landing_page: window.location.href,
      captured_at: new Date().toISOString(),
    })
  );
}

function captureAttribution() {
  const current = trackingFromUrl();
  if (!hasTracking(current)) return;
  if (!readStoredTracking("first")) {
    writeStoredTracking("first", current);
  }
  writeStoredTracking("latest", current);
}

function createSubmissionId(kind) {
  const random =
    window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${kind}-${random}`;
}

function serializeForm(form) {
  const formData = new FormData(form);
  const fields = {};

  for (const [key, value] of formData.entries()) {
    if (key === "website") continue;
    const normalized = String(value).trim();
    if (normalized) fields[key] = normalized;
  }

  return fields;
}

function resolveTracking(form) {
  const tracking = { ...getTrackingParams() };
  const campaign = form.getAttribute("data-utm-campaign");
  if (campaign) {
    tracking.utm_campaign = campaign;
    if (!tracking.utm_medium) tracking.utm_medium = "site";
  }
  return tracking;
}

function makePayload(form) {
  const kind = form.getAttribute("data-intake-kind") || "general";
  const fields = serializeForm(form);
  const consentGiven = fields.consent === "yes";
  const createdAt = new Date().toISOString();

  return {
    submission_id: createSubmissionId(kind),
    kind,
    created_at: createdAt,
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer || "",
    user_agent: navigator.userAgent || "",
    consent: consentGiven ? "yes" : "",
    consent_at: consentGiven ? createdAt : "",
    consent_text: consentGiven ? consentText : "",
    tracking: resolveTracking(form),
    fields,
  };
}

function payloadToEmailBody(payload) {
  const lines = [
    `submission_id: ${payload.submission_id}`,
    `kind: ${payload.kind}`,
    `created_at: ${payload.created_at}`,
    `consent: ${payload.consent || ""}`,
    `consent_at: ${payload.consent_at || ""}`,
    `consent_text: ${payload.consent_text || ""}`,
    `page_url: ${payload.page_url}`,
    `referrer: ${payload.referrer}`,
    "",
    ...Object.entries(payload.tracking)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`),
    "",
    ...Object.entries(payload.fields).map(([key, value]) => `${key}: ${value}`),
  ];

  return lines.filter((line, index, arr) => line || arr[index - 1]).join("\n");
}

function setStatus(form, message, state = "info") {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.hidden = false;
  status.textContent = message;
  status.setAttribute("data-state", state);
}

function setLoading(form, loading) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  button.disabled = loading;
  button.setAttribute("aria-busy", loading ? "true" : "false");
  button.textContent = loading ? "Submitting..." : button.dataset.originalText || button.textContent;
}

function validateConsent(form) {
  const consent = form.elements.namedItem("consent");
  if (!consent) return true;

  if (consent.checked) {
    consent.setCustomValidity("");
    return true;
  }

  consent.setCustomValidity("Please agree to the terms and privacy policy before submitting.");
  consent.reportValidity();
  setStatus(form, "Please agree to the terms and privacy policy before submitting.", "error");
  return false;
}

function storageAvailable() {
  try {
    const key = `${draftStoragePrefix}test`;
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function draftKey(form) {
  const kind = form.getAttribute("data-intake-kind") || "general";
  return `${draftStoragePrefix}${kind}:${window.location.pathname}`;
}

function draftFields(form) {
  return draftFieldNames
    .map((name) => form.elements.namedItem(name))
    .filter((field) => field && typeof field === "object");
}

function readDraft(form) {
  if (!storageAvailable()) return {};
  try {
    return JSON.parse(window.localStorage.getItem(draftKey(form)) || "{}");
  } catch {
    return {};
  }
}

function writeDraft(form) {
  if (!storageAvailable()) return;
  const draft = {};

  for (const field of draftFields(form)) {
    if (!field.name || field.name === "website") continue;
    const value = field.type === "checkbox" ? (field.checked ? field.value : "") : String(field.value || "").trim();
    if (value) draft[field.name] = value;
  }

  if (Object.keys(draft).length) {
    window.localStorage.setItem(draftKey(form), JSON.stringify(draft));
  } else {
    window.localStorage.removeItem(draftKey(form));
  }
}

function restoreDraft(form) {
  const draft = readDraft(form);
  let restored = false;

  for (const field of draftFields(form)) {
    const value = draft[field.name];
    if (!value || String(field.value || "").trim()) continue;
    if (field.type === "checkbox") {
      field.checked = field.value === value;
    } else {
      field.value = value;
    }
    restored = true;
  }

  if (restored) {
    setStatus(form, "Draft restored from this browser.", "info");
  }
}

function clearDraft(form) {
  if (!storageAvailable()) return;
  window.localStorage.removeItem(draftKey(form));
}

function openEmailFallback(form, payload) {
  const subject = form.getAttribute("data-mail-subject") || "Video Editor Jobs intake";
  const body = payloadToEmailBody(payload);
  const mailto = `mailto:${fallbackRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function successUrl(form, payload) {
  const path = form.getAttribute("data-success-path");
  if (!path) return "";
  const url = new URL(path, window.location.origin);
  url.searchParams.set("kind", payload.kind);
  url.searchParams.set("submission_id", payload.submission_id);
  url.searchParams.set("source_path", payload.page_path);

  for (const [key, value] of Object.entries(payload.tracking || {})) {
    if (value) url.searchParams.set(key, value);
  }

  return url.toString();
}

function redirectAfterSuccess(form, payload) {
  const url = successUrl(form, payload);
  if (!url) return;
  window.setTimeout(() => {
    window.location.href = url;
  }, 450);
}

async function submitToSheet(endpoint, payload) {
  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });
}

captureAttribution();

document.querySelectorAll("form[data-intake-kind]").forEach((form) => {
  const button = form.querySelector('button[type="submit"]');
  if (button) button.dataset.originalText = button.textContent;
  restoreDraft(form);

  form.addEventListener("input", () => writeDraft(form));
  form.addEventListener("change", () => {
    validateConsent(form);
    writeDraft(form);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateConsent(form)) return;
    if (!form.reportValidity()) return;
    if (String(new FormData(form).get("website") || "").trim()) {
      setStatus(form, "Thanks, your submission was received.", "success");
      form.reset();
      clearDraft(form);
      return;
    }

    const payload = makePayload(form);
    const endpoint = getEndpoint();

    if (!endpoint) {
      setStatus(form, "Google Sheets is not connected yet. Opening an email draft with your details.", "warning");
      openEmailFallback(form, payload);
      return;
    }

    setLoading(form, true);
    setStatus(form, "Submitting...", "info");

    try {
      await submitToSheet(endpoint, payload);
      form.reset();
      clearDraft(form);
      setStatus(form, "Sent. We will review it and follow up when there is a fit.", "success");
      redirectAfterSuccess(form, payload);
    } catch (error) {
      console.error(error);
      setStatus(form, "Submission failed. Opening an email draft so your details are not lost.", "error");
      openEmailFallback(form, payload);
    } finally {
      setLoading(form, false);
    }
  });
});
