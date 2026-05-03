const letters = "ABCDEÉFGHIJKLMNOPQRSTUVWXYZ";

export function initHackerEffect() {
  const h1 = document.querySelector("h1") as HTMLElement;

  if (!h1) return;

  h1.onmouseover = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.dataset.value) {
      target.dataset.value = target.innerText;
    }

    let iterations = 0;
    const originalValue = target.dataset.value;

    target.classList.add("animating");

    const interval = setInterval(() => {
      target.innerText = target.innerText
        .split("")
        .map((_, index) => {
          if (index < iterations) return originalValue[index];

          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iterations >= originalValue.length) {
        clearInterval(interval);
        target.classList.remove("animating");
      }

      iterations += 1 / 3;
    }, 30);
  };
}
