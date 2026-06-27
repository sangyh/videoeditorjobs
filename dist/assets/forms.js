const recipient = "sangy@rightjoin.co";

function serializeForm(form) {
  const data = new FormData(form);
  return Array.from(data.entries())
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

document.querySelectorAll("form[data-mail-subject]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const subject = form.getAttribute("data-mail-subject") || "Video Editor Jobs";
    const body = serializeForm(form);
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
});
