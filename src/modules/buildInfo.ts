export async function loadBuildInfo() {
  const elements = document.querySelectorAll("[data-system]");
  let data: Record<string, string> = {};

  try {
    const res = await fetch("./assets/build-info.json");
    if (!res.ok) throw new Error();
    const rawData = await res.json();

    data = {
      lastDeployment: `${rawData.lastDeployment} from github.actions`,
      commit: rawData.commit,
      status: rawData.status,
    };
  } catch {
    const now = new Date();
    data = {
      lastDeployment: now.toLocaleString() + " (local dev)",
      commit: "local-branch",
      status: "running",
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
