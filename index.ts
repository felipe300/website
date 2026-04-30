const letters = "ABCDEÉFGHIJKLMNOPQRSTUVWXYZ";
const h1 = document.querySelector("h1") as HTMLElement;

h1.onmouseover = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.dataset.value) target.dataset.value = target.innerText;

  let iterations = 0;
  const originalValue = target.dataset.value;
  target.classList.add("animating");

  const interval = setInterval(() => {
    target.innerText = target.innerText
      .split("")
      .map((_, index) => {
        if (index < iterations) return originalValue[index];
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iterations >= originalValue.length) {
      clearInterval(interval);
      target.classList.remove("animating");
    }
    iterations += 1 / 3;
  }, 30);
};

const setupClickToCopy = (selector: string, isEmail: boolean = false) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) return;

  const originalText = element.innerText;

  element.addEventListener("click", async (e) => {
    if (isEmail) e.preventDefault();

    const textToCopy = isEmail
      ? element.getAttribute("href")?.replace("mailto:", "")
      : element.getAttribute("href");

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      element.innerText = "[ COPIED TO CLIPBOARD! ]";

      setTimeout(() => {
        element.innerText = originalText;
        if (isEmail) window.location.href = `mailto:${textToCopy}`;
      }, 1500);
    }
  });
};

setupClickToCopy('a[href^="mailto:"]', true);
setupClickToCopy('a[href*="github.com"]');
