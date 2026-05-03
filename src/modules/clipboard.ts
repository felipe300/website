export function setupClickToCopy(selector: string, isEmail: boolean = false) {
  const element = document.querySelector(selector) as HTMLElement;

  if (!element) return;

  const originalText = element.innerText;

  element.addEventListener("click", async (e) => {
    if (isEmail) e.preventDefault();

    const textToCopy = isEmail
      ? element.getAttribute("href")?.replace("mailto:", "")
      : element.getAttribute("href");

    if (!textToCopy) return;

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
