export async function loadBuildInfo() {
  const elements = document.querySelectorAll("[data-system]");

  let data: Record<string, string> = {};

  try {
    const res = await fetch("./assets/build-info.json");
    if (!res.ok) throw new Error();
    data = await res.json();
  } catch {
    data = {
      "last-login": new Date().toUTCString() + " (local dev)",
    };
  }

  elements.forEach((el) => {
    const key = el.getAttribute("data-system");
    if (!key) return;

    const value = data[key];
    if (value) {
      el.textContent = value;
    }
  });
}
