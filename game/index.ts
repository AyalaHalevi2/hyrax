// index.ts
//data
let offset = 0;
const jumpDuration = 300; // ms (smoother)
const scrollSpeed = 4;
const jumpHeight = 20; // px (higher)
const hyraxHeight = 30; // %
let run = true;
let score = sessionStorage.getItem("score") ? JSON.parse(sessionStorage.getItem("score")!) : 0;
let maxScore = localStorage.getItem("maxscore") ? JSON.parse(localStorage.getItem("maxscore")!) : 0;

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
    this.htmlElement.style.transition = `bottom ${jumpDuration}ms ease-out`;
    this.htmlElement.style.bottom = `${hyraxHeight + jumpHeight}%`;

    // this.htmlElement.style.animation = "jump 0.3s ease-in-out";
    setTimeout(() => {
      this.htmlElement.style.transition = `bottom ${jumpDuration}ms ease-in`;
      this.htmlElement.style.bottom = `${hyraxHeight}%`;

      setTimeout(() => {
        this.htmlElement.style.animation = "run-cycle 0.3s steps(4) infinite";
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
//control functions
window.addEventListener("DOMContentLoaded", () => {
  try {
    const container = document.getElementById("game-container");
    if (!container) throw new Error("game-container element not found");
    animateBackground(container);
    updateCactus(container);
    const hyraxInHTML = document.getElementById("hyrax-runner") as HTMLElement;
    if (!hyraxInHTML) throw new Error("hyrax-runner element not found");
    const hyrax = new Hyrax(hyraxInHTML);
    startCollisionDetection(hyrax, container);
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") hyrax.jump();
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

function animateBackground(container: HTMLElement) {
  try {
    offset -= scrollSpeed;
    container.style.backgroundPositionX = `${offset}px`;
    requestAnimationFrame(() => animateBackground(container));
  } catch (error) {
    console.error("animateBackground error: ", error);
  }
}

function updateCactus(container: HTMLElement) {
  try {
    if (!run) return;

    const frames = container.clientWidth / scrollSpeed;

    setInterval(() => {
      const possibleDelays = [100, 400, 700, 1000, 1500, 2000];
      const a =
        possibleDelays[Math.floor(Math.random() * possibleDelays.length)];
      setTimeout(() => {
        const cactus = new Cactus();
        cactus.htmlElement.style.animation = `cactus-movement ${frames / 60}s linear forwards`;
        setTimeout(() => {
          if (cactus.htmlElement && cactus.htmlElement.parentNode) {
            cactus.htmlElement.parentNode.removeChild(cactus.htmlElement);
          }
        }, (frames / 60) * 1000);
      }, a);
    }, 3000);
  } catch (error) {
    console.error("Error moving cactus: ", error);
  }
}

function startCollisionDetection(hyrax: Hyrax, container: HTMLElement) {
  try {
    const collisionInterval = setInterval(() => {
      if (!run) {
        clearInterval(collisionInterval);
        return;
      }
      const hyraxElement = document.getElementById("hyrax-runner");
      if (!hyraxElement) return;
      isCollision(hyrax, container);
    }, 10);
  } catch (error) {
    console.error("startCollisionDetection error: ", error);
  }
}

function isCollision(hyrax: Hyrax, container: HTMLElement) {
  try {
    const cactusElements = document.querySelectorAll(".cactus");
    if (!cactusElements) throw new Error("no cactus class element");

    const hyraxRect = hyrax.htmlElement.getBoundingClientRect();
    cactusElements.forEach((cactusElement) => {
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
        hyraxLeft < cactusRight && hyraxRight > cactusLeft && hyraxTop < cactusBottom && hyraxBottom > cactusTop;
      const hyraxCenter = hyraxRect.left + hyraxRect.width / 2;
      const cactusCenter = cactusRect.left + cactusRect.width / 2;
      if (hyraxCenter > cactusCenter && !isOverlapping && hyrax.isJump) {
        setTimeout(()=>{score += 100; // Award 100 points for successful jump
        renderScore();})

        console.log("Successful jump! +100 points");
      }
      if (isOverlapping && !hyrax.isDead) {
        console.log("Collision detected!");
        hyrax.die();
        hyrax.htmlElement.style.animation = "none";
        offset = 0
        container.style.animation = "none";
        cactusElements.forEach((cactus) => {
          (cactus as HTMLElement).style.animation = "none";
          (cactus as HTMLElement).style.animationPlayState = "paused";
        });
        return;
      }
    });
  } catch (error) {
    console.error("isCollision error: ", error);
  }
}
