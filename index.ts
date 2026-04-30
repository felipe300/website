const letters = "ABCDEÉFGHIJKLMNOPQRSTUVWXYZ";
let h1 = document.querySelector("h1") as HTMLElement;

h1.onmouseover = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (!target.dataset.value) {
    target.dataset.value = target.innerText;
  }

  let iterations = 0;
  const originalValue = target.dataset.value || target.innerText;

  let interval: Timer = setInterval(() => {
    clearInterval(interval);
    target.innerText = target.innerText
      .split("")
      .map((_letter, index) => {
        if (index < iterations) {
          return originalValue[index];
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iterations >= originalValue.length) {
      clearInterval(interval);
    }

    iterations += 1 / 5;
  }, 30);
};

