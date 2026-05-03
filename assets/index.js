// src/modules/hacker.ts
var letters = "ABCDEÉFGHIJKLMNOPQRSTUVWXYZ";
function initHackerEffect() {
  const h1 = document.querySelector("h1");
  if (!h1)
    return;
  h1.onmouseover = (event) => {
    const target = event.target;
    if (!target.dataset.value) {
      target.dataset.value = target.innerText;
    }
    let iterations = 0;
    const originalValue = target.dataset.value;
    target.classList.add("animating");
    const interval = setInterval(() => {
      target.innerText = target.innerText.split("").map((_, index) => {
        if (index < iterations)
          return originalValue[index];
        return letters[Math.floor(Math.random() * letters.length)];
      }).join("");
      if (iterations >= originalValue.length) {
        clearInterval(interval);
        target.classList.remove("animating");
      }
      iterations += 1 / 3;
    }, 30);
  };
}

// src/modules/background.ts
var letters2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var chars = letters2 + "ABCDEF0123456789";
function initBackground() {
  const bgLayer = document.getElementById("hacker-layer");
  if (!bgLayer)
    return;
  const generateText = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const fontSize = 10;
    const columns = Math.ceil(width / (fontSize * 0.6));
    const rows = Math.ceil(height / fontSize);
    const totalChars = columns * rows * 1.2;
    let str = "";
    for (let i = 0;i < totalChars; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    bgLayer.innerText = str;
  };
  generateText();
  setInterval(generateText, 70);
  window.addEventListener("resize", generateText);
  window.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
  });
}

// src/modules/clipboard.ts
function setupClickToCopy(selector, isEmail = false) {
  const element = document.querySelector(selector);
  if (!element)
    return;
  const originalText = element.innerText;
  element.addEventListener("click", async (e) => {
    if (isEmail)
      e.preventDefault();
    const textToCopy = isEmail ? element.getAttribute("href")?.replace("mailto:", "") : element.getAttribute("href");
    if (!textToCopy)
      return;
    await navigator.clipboard.writeText(textToCopy);
    element.innerText = "[ COPIED TO CLIPBOARD! ]";
    setTimeout(() => {
      element.innerText = originalText;
      if (isEmail) {
        window.location.href = `mailto:${textToCopy}`;
      }
    }, 1500);
  });
}

// src/modules/i18n.ts
var translations = {
  common: {}
};
async function loadTranslations() {
  try {
    const response = await fetch("./lang.json");
    console.log("status:", response.status);
    console.log("url:", response.url);
    const text = await response.text();
    console.log(text);
    translations = JSON.parse(text);
    const savedLang = localStorage.getItem("prefLang") || "es";
    applyLanguage(savedLang);
    setupLanguageButtons();
  } catch (error) {
    console.error("Error cargando traducciones:", error);
  }
}
function setupLanguageButtons() {
  document.getElementById("btn-es")?.addEventListener("click", () => {
    applyLanguage("es");
  });
  document.getElementById("btn-en")?.addEventListener("click", () => {
    applyLanguage("en");
  });
}
function applyLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  const button = document.getElementById(`btn-${lang}`);
  document.querySelectorAll(".lang-switcher a").forEach((a) => a.classList.remove("active"));
  const mergedTranslations = {
    ...translations.common,
    ...translations[lang]
  };
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key)
      return;
    const value = mergedTranslations[key];
    if (value !== undefined) {
      el.textContent = value;
    } else {
      console.warn(`Missing translation for key: ${key}`);
    }
  });
  if (button) {
    button.classList.add("active");
  }
  localStorage.setItem("prefLang", lang);
}

// src/modules/buildInfo.ts
async function loadBuildInfo() {
  const elements = document.querySelectorAll("[data-system]");
  let data = {};
  try {
    const res = await fetch("./assets/build-info.json");
    if (!res.ok)
      throw new Error;
    const rawData = await res.json();
    data = {
      "last-login": `${rawData.lastDeployment} from github.actions`,
      commit: rawData.commit,
      status: rawData.status
    };
  } catch {
    const now = new Date;
    data = {
      "last-login": now.toLocaleString() + " (local dev)",
      commit: "local-branch",
      status: "running"
    };
  }
  elements.forEach((el) => {
    const key = el.getAttribute("data-system");
    if (!key)
      return;
    const value = data[key];
    if (value) {
      el.textContent = value;
    }
  });
}

// src/main.ts
document.addEventListener("DOMContentLoaded", () => {
  initHackerEffect();
  initBackground();
  setupClickToCopy('a[href^="mailto:"]', true);
  setupClickToCopy('a[href*="github.com"]');
  loadTranslations();
  loadBuildInfo();
});
