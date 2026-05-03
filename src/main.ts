import { initHackerEffect } from "./modules/hacker";
import { initBackground } from "./modules/background";
import { setupClickToCopy } from "./modules/clipboard";
import { loadTranslations } from "./modules/i18n";
import { loadBuildInfo } from "./modules/buildInfo";

document.addEventListener("DOMContentLoaded", () => {
  initHackerEffect();
  initBackground();

  setupClickToCopy('a[href^="mailto:"]', true);
  setupClickToCopy('a[href*="github.com"]');

  loadTranslations();
  loadBuildInfo();
});
