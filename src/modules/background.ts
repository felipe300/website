const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const chars = letters + "ABCDEF0123456789";

export function initBackground() {
  const bgLayer = document.getElementById("hacker-layer") as HTMLElement;

  if (!bgLayer) return;

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
}
