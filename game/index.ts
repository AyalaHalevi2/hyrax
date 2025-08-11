let offset = 0;
const jumpDuration = 250; //ms
const scrollSpeed = 4;
const jumpHeight = 20; //
const hyraxHeight = 30; //%
let run = true;
let score = sessionStorage.getItem("score")
  ? JSON.parse(sessionStorage.getItem("score")!)
  : 0;
let maxScore = localStorage.getItem("maxscore")
  ? JSON.parse(localStorage.getItem("maxscore")!)
  : 0;
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
    const computedStyle = window.getComputedStyle(this.htmlElement);
    const currentFrame = computedStyle.backgroundPositionX;
    this.htmlElement.style.animation = "none";
    this.htmlElement.style.backgroundPositionX = currentFrame;
    this.htmlElement.style.animation = "jump 0.3s ease-in-out";
    // setTimeout(() => {
    //   this.htmlElement.style.transition = `bottom ${jumpDuration}ms ease-in`;
    //   this.htmlElement.style.bottom = `${hyraxHeight}%`;

      setTimeout(() => {
        this.htmlElement.style.animation = "run-cycle 0.3s steps(4) infinite";
        this.isJump = false;
        console.log("after jumping: " + offset);
      }, jumpDuration);}
  //   }, jumpDuration);
  // }
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
    } catch (error) {}
  }
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    animateBackground();
    updateCactus();
    const hyraxInHTML = document.getElementById("hyrax-runner") as HTMLElement;
    if (!hyraxInHTML) throw new Error("hyrax-runner element not found");
    const hyrax = new Hyrax(hyraxInHTML);
    // setInterval(() => {
    //   isCollision(hyraxInHTML);
    // }, 1000);

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
    scoreinhtml.innerHTML = score;
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
      }, a);
    }, 1000);
  } catch (error) {
    console.error("Error moving cactus: ", error);
  }
}
function isCollision(hyrax: HTMLElement) {
  console.log(hyrax.style.bottom);
}
