import type { Translations } from "../types/translations";

let translations: Translations = {
  common: {},
};

export async function loadTranslations() {
  try {
    const response = await fetch("./lang.json");

    console.log("status:", response.status);
    console.log("url:", response.url);

    const text = await response.text();
    console.log(text);
    translations = JSON.parse(text);

    // translations = await response.json();

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

export function applyLanguage(lang: string) {
  const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");
  const button = document.getElementById(`btn-${lang}`);

  document.querySelectorAll(".lang-switcher a").forEach((a) => a.classList.remove("active"));

  const mergedTranslations = {
    ...translations.common,
    ...translations[lang],
  };

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");

    if (!key) return;

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
