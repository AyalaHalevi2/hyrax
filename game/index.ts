// index.ts
let offset = 0;
const jumpDuration = 500; // ms (smoother)
const scrollSpeed = 4;
const jumpHeight = 60; // px (higher)
const hyraxHeight = 30; // %
let run = true;
let score = sessionStorage.getItem("score")
  ? JSON.parse(sessionStorage.getItem("score")!)
  : 0;
let maxScore = localStorage.getItem("maxscore")
  ? JSON.parse(localStorage.getItem("maxscore")!)
  : 0;

let hyraxInstance: Hyrax;

class Hyrax {
  htmlElement: HTMLElement;
  position: { x: number; y: number };
  isJump: boolean;
  isDead: boolean;
  isSlide: boolean;
  score: number;
  constructor(elment: HTMLElement) {
    this.htmlElement = elment;
    this.position = { x: 0, y: 0 };
    this.isJump = false;
    this.isDead = false;
    this.isSlide = false;
    this.score = 0;
  }
  jump() {
    if (this.isJump) return;
    this.isJump = true;

    // freeze current sprite frame during jump
    const computedStyle = window.getComputedStyle(this.htmlElement);
    const currentFrame = computedStyle.backgroundPositionX;
    this.htmlElement.style.animation = "none";
    this.htmlElement.style.backgroundPositionX = currentFrame;

    // pass vars to CSS so we can tune from TS
    this.htmlElement.style.setProperty("--jump-peak", `${jumpHeight}px`);
    this.htmlElement.style.setProperty("--jump-duration", `${jumpDuration}ms`);

    // smooth jump motion
    this.htmlElement.style.animation = `jump var(--jump-duration) cubic-bezier(0.2, 0.6, 0.2, 1)`;

    setTimeout(() => {
      // resume run cycle
      this.htmlElement.style.animation = "run-cycle 0.45s steps(4) infinite";
      this.isJump = false;
      console.log("after jumping: " + offset);
    }, jumpDuration);

    }, jumpDuration);
  }

  die() {
    this.isDead = true;
    run = false;
    this.htmlElement.style.animation = "none";
    console.log("Game Over! Score:", score);
    if (score > maxScore) {
      maxScore = score;
      localStorage.setItem("maxscore", JSON.stringify(maxScore));
    }
  }
}

class Obstacle {
  htmlElement: HTMLElement;
  position: { x: number; y: number };
  constructor() {
    this.position = { x: 0, y: 0 };
  }
}

class Cactus extends Obstacle {
  constructor() {
    super();
    this.position.y = 30;
    this.renderCactus();
  }
  renderCactus() {
    try {
      const cactusContainer = document.getElementById("cactusRoot");
      if (!cactusContainer) throw new Error("cactusRoot element not found");
      this.htmlElement = document.createElement("div");
      this.htmlElement.className = "cactus";
      cactusContainer.appendChild(this.htmlElement);
      this.htmlElement = this.htmlElement;
    } catch (error) {
      console.error(error);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    animateBackground();
    updateCactus();
    startCollisionDetection();

    const hyraxInHTML = document.getElementById("hyrax-runner") as HTMLElement;
    if (!hyraxInHTML) throw new Error("hyrax-runner element not found");

    hyraxInstance = new Hyrax(hyraxInHTML);

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") hyraxInstance.jump();
    });
  } catch (error) {
    console.error("Event error: ", error);
  }
});

function renderScore() {
  try {
    const scoreinhtml = document.getElementById("scoreRoot");
    if (!scoreinhtml) throw new Error("scoreRoot not found");
    sessionStorage.setItem("score", JSON.stringify(score));
    scoreinhtml.innerHTML = score.toString();
  } catch (error) {
    console.error("renderScore error: ", error);
  }
}

function animateBackground() {
  try {
    const container = document.getElementById("game-container") as HTMLElement;
    if (!container) throw new Error("game-container element not found");
    offset -= scrollSpeed;
    container.style.backgroundPositionX = `${offset}px`;
    requestAnimationFrame(animateBackground);
  } catch (error) {
    console.error("animateBackground error: ", error);
  }
}

function updateCactus() {
  try {
    if (!run) return;

    const container = document.getElementById("game-container");
    if (!container) throw new Error("game-container element not found");
    const frames = container.clientWidth / scrollSpeed;

    setInterval(() => {
      const a = Math.floor(Math.random() * 10) * 50;
      setTimeout(() => {
        const cactus = new Cactus();
        cactus.htmlElement.style.animation = `cactus-movement ${
          frames / 60
        }s linear forwards`;
        setTimeout(() => {
          if (cactus.htmlElement && cactus.htmlElement.parentNode) {
            cactus.htmlElement.parentNode.removeChild(cactus.htmlElement);
          }
        }, (frames / 60) * 1000);
      }, a);
    }, 1000);
  } catch (error) {
    console.error("Error moving cactus: ", error);
  }
}

function startCollisionDetection() {
  try {
    const collisionInterval = setInterval(() => {
      if (!run) {
        clearInterval(collisionInterval);
        return;
      }
      const hyraxElement = document.getElementById("hyrax-runner");
      if (!hyraxElement) return;
      isCollision(hyraxElement as HTMLElement);
    }, 10);
  } catch (error) {
    console.error("startCollisionDetection error: ", error);
  }
}

function isCollision(hyrax: HTMLElement) {
  try {
    const cactusElements = document.querySelectorAll(".cactus");

    cactusElements.forEach((cactusElement) => {
      const hyraxRect = hyrax.getBoundingClientRect();
      const cactusRect = cactusElement.getBoundingClientRect();

      const margin = 10;

      const hyraxLeft = hyraxRect.left + margin;
      const hyraxRight = hyraxRect.right - margin;
      const hyraxTop = hyraxRect.top + margin;
      const hyraxBottom = hyraxRect.bottom - margin;

      const cactusLeft = cactusRect.left;
      const cactusRight = cactusRect.right;
      const cactusTop = cactusRect.top;
      const cactusBottom = cactusRect.bottom;

      const isOverlapping =
        hyraxLeft < cactusRight &&
        hyraxRight > cactusLeft &&
        hyraxTop < cactusBottom &&
        hyraxBottom > cactusTop;

      if (isOverlapping && !hyraxInstance.isDead) {
        console.log("Collision detected!");
        hyraxInstance.die();
        return;
      }
    });
  } catch (error) {
    console.error("isCollision error: ", error);
  }
}
