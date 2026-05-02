const letters = "ABCDEÉFGHIJKLMNOPQRSTUVWXYZ";
const chars = letters + "ABCDEF0123456789";
const h1 = document.querySelector("h1") as HTMLElement;
const bgLayer = document.getElementById("hacker-layer") as HTMLElement;

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

const generateText = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const fontSize = 10;
  const columns = Math.ceil(width / (fontSize * 0.6));
  const rows = Math.ceil(height / fontSize);
  const totalChars = columns * rows * 1.2;

  let str = "";
  for (let i = 0; i < totalChars; i++) {
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

setupClickToCopy('a[href^="mailto:"]', true);
setupClickToCopy('a[href*="github.com"]');
