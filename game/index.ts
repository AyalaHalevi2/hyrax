const container = document.getElementById("game-container") as HTMLElement;
const hyrax = document.getElementById("hyrax-runner") as HTMLElement;

let offset = 0;
const scrollSpeed = 1;
const jumpHeight = 120;
const jumpDuration = 500;
let isJumping = false;

function animateBackground() {
  offset -= scrollSpeed;
  container.style.backgroundPositionX = `${offset}px`;
  requestAnimationFrame(animateBackground);
}

function jump() {
  if (isJumping) return;

  isJumping = true;

  const computedStyle = window.getComputedStyle(hyrax);
  const currentFrame = computedStyle.backgroundPositionX;

  hyrax.style.animation = "none";
  hyrax.style.backgroundPositionX = currentFrame;
  hyrax.style.transition = `bottom ${jumpDuration / 2}ms ease-out`;
  hyrax.style.bottom = `${222 + jumpHeight}px`;

  setTimeout(() => {
    hyrax.style.transition = `bottom ${jumpDuration / 2}ms ease-in`;
    hyrax.style.bottom = `222px`;

    setTimeout(() => {
      hyrax.style.animation = "run-cycle 0.3s steps(4) infinite";
      isJumping = false;
    }, jumpDuration / 2);
  }, jumpDuration / 2);
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.code === "Space") {
    jump();
  }
});

animateBackground();
