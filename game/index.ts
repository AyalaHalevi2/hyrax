let offset = 0;
const jumpDuration = 250; //ms
const scrollSpeed = 1;
const jumpHeight = 20; //
const hyraxHeight = 30; //%
let score = sessionStorage.getItem("score") ? JSON.parse(sessionStorage.getItem("score")!) : 0;
let maxScore = localStorage.getItem("maxscore") ? JSON.parse(localStorage.getItem("maxscore")!) : 0;
class Hyrax {
  htmlElement: HTMLElement;
  posiotion: { x: number; y: number };
  isJump: boolean;
  isDead: boolean;
  isSlide: boolean;
  score: number;
  constructor(elment: HTMLElement) {
    this.htmlElement = elment;
    this.posiotion = { x: 0, y: 0 };
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
    this.htmlElement.style.transition = `bottom ${jumpDuration}ms ease-out`;
    this.htmlElement.style.bottom = `${hyraxHeight + jumpHeight}%`;

    setTimeout(() => {
      this.htmlElement.style.transition = `bottom ${jumpDuration}ms ease-in`;
      this.htmlElement.style.bottom = `${hyraxHeight}%`;

      setTimeout(() => {
        this.htmlElement.style.animation = "run-cycle 0.3s steps(4) infinite";
        this.isJump = false;
      }, jumpDuration);
    }, jumpDuration);
  }
}

class Obstacle {
  htmlElement: HTMLElement;
  position: { x: number; y: number };
  constructor() {
    this.position = { x: 0, y: 0 };
  }
}
class Bird extends Obstacle {
  constructor() {
    super();
    this.position.y = 30; //%
    this.renderBird();
  }
  htmlBird(): string {
    return `<div class="bird" style="bottom: ${this.position.y}%;"></div>`;
  }
  renderBird() {
    try {
      const birdsContainer = document.getElementById("birdRoot");
      if (!birdsContainer) throw new Error("birdRoot element not found");
      // birdsContainer.textContent+=this.htmlBird()- need to replace this
    } catch (error) {
      console.error("Error renderBire: ");
    }
  }
}
window.addEventListener("DOMContentLoaded", () => {
  try {
    animateBackground();
    const hyraxInHTML = document.getElementById("hyrax-runner") as HTMLElement;
    if (!hyraxInHTML) throw new Error("hyrax-runner element not found");
    const hyrax = new Hyrax(hyraxInHTML);
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") hyrax.jump();
    });
  } catch (error) {
    console.error("Event error: ", error);
  }
});
function renderScore(): void {
  try {
    const scoreinhtml = document.getElementById("scoreRoot");
    if (!scoreinhtml) throw new Error("scoreRoot not found");
    sessionStorage.setItem("score", JSON.stringify(score));
    scoreinhtml.innerHTML = score;
    // const maxscoreinhtml = document.getElementById("maxscoreRoot");
    // if (!maxscoreinhtml) throw new Error("maxscoreRoot not found");
    // sessionStorage.setItem("maxscore", JSON.stringify(maxScore));
    // maxScore = score > maxScore ? score : maxScore;
    // localStorage.setItem("maxscore", JSON.stringify(maxScore));
    // maxscoreinhtml.innerHTML = maxScore;
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

// let offset = 0;
// const scrollSpeed = 1;
// const jumpHeight = 120;
// const jumpDuration = 500;

// let isJumping = false;

// function jump() {
//   if (isJumping) return;

//   isJumping = true;

//   const computedStyle = window.getComputedStyle(hyrax);
//   const currentFrame = computedStyle.backgroundPositionX;

//   hyrax.style.animation = "none";
//   hyrax.style.backgroundPositionX = currentFrame;
//   hyrax.style.transition = `bottom ${jumpDuration / 2}ms ease-out`;
//   hyrax.style.bottom = `${222 + jumpHeight}px`;

//   setTimeout(() => {
//     hyrax.style.transition = `bottom ${jumpDuration / 2}ms ease-in`;
//     hyrax.style.bottom = `222px`;

//     setTimeout(() => {
//       hyrax.style.animation = "run-cycle 0.3s steps(4) infinite";
//       isJumping = false;
//     }, jumpDuration / 2);
//   }, jumpDuration / 2);
// }
