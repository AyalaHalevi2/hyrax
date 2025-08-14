let offset = 0;
const jumpDuration = 400;
const scrollSpeed = 4;
const jumpHeight = 30;
const hyraxHeight = 30;
let run = true;

let maxScore = localStorage.getItem("maxscore")
  ? JSON.parse(localStorage.getItem("maxscore")!)
  : 0;

// ADDED: keep references so we can restart without reloading the page
let hyraxRef: Hyrax | null = null; // reason: needed by restart to reset score/animation
let containerRef: HTMLElement | null = null; // reason: needed by restart to re-run loops

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
    this.isSlide = false;
    this.isDead = false; // CHANGED: explicitly initialize; reason: used during restart/collision
    this.score = 0;
    renderScore(this);
  }
  //model
  jump() {
    if (this.isJump || !run) return;
    this.isJump = true;
    // freeze current sprite frame during jump
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
        console.log("after jumping: " + offset);
      }, jumpDuration);
    }, jumpDuration);
  }
  //model
}
//data
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
  //view
  renderCactus() {
    try {
      if (!run) return;
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
//view
function renderScore(hyrax: Hyrax) {
  try {
    const scoreinhtml = document.getElementById("scoreRoot");
    if (!scoreinhtml) throw new Error("scoreRoot not found");
    sessionStorage.setItem("score", JSON.stringify(hyrax.score));
    scoreinhtml.innerHTML = hyrax.score.toString();
  } catch (error) {
    console.error("renderScore error: ", error);
  }
}

// ADDED: render max score in both the top bar and the game-over overlay
function renderMaxScore() {
  try {
    const topMax = document.getElementById("maxscoreRoot");
    if (topMax) topMax.textContent = String(maxScore); // reason: keep top bar always showing current max
    const overlayMax = document.getElementById("maxscoreOverlay");
    if (overlayMax) overlayMax.textContent = String(maxScore); // reason: replace placeholder with real max score
  } catch (error) {
    console.error("renderMaxScore error: ", error);
  }
}

//control functions
window.addEventListener("DOMContentLoaded", () => {
  try {
    const container = document.getElementById("game-container");
    if (!container) throw new Error("game-container element not found");
    containerRef = container; // ADDED: save for restart

    animateBackground(container);
    updateCactus(container);

    const hyraxInHTML = document.getElementById("hyrax-runner") as HTMLElement;
    if (!hyraxInHTML) throw new Error("hyrax-runner element not found");
    const hyrax = new Hyrax(hyraxInHTML);
    hyraxRef = hyrax; // ADDED: save for restart

    startCollisionDetection(hyrax, container);
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") hyrax.jump();
    });

    renderMaxScore(); // ADDED: show max on initial load

    // ADDED: hook up restart button to reset state and resume loops
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        // reason: user requested a restart button that restarts the game
        restartGame();
      });
    }
  } catch (error) {
    console.error("Event error: ", error);
  }
});

function updateCactus(container: HTMLElement) {
  try {
    const frames = container.clientWidth / scrollSpeed;
    const addCactusInterval = setInterval(() => {
      if (!run) {
        clearInterval(addCactusInterval);
        return;
      }
      const rendonAdditionalTime = Math.floor(Math.random() * 5) * 50;
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
      }, rendonAdditionalTime);
    }, 2500);
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
//control
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
        hyraxLeft < cactusRight &&
        hyraxRight > cactusLeft &&
        hyraxTop < cactusBottom &&
        hyraxBottom > cactusTop;
      const hyraxCenter = hyraxRect.left + hyraxRect.width / 2;
      const cactusCenter = cactusRect.left + cactusRect.width / 2;
      if (hyraxCenter > cactusCenter && !isOverlapping && hyrax.isJump) {
        hyrax.score += 100; // Award 100 points for successful jump
        renderScore(hyrax);
        console.log("Successful jump! +100 points");
      }
      if (isOverlapping && !hyrax.isDead) {
        console.log("Collision detected!");
        run = false;
        hyrax.isDead = true; // ADDED: mark dead so repeated collisions don't spam; reason: protects logic
        gameOver(hyrax, container);
        cactusElements.forEach((cactus) => cactus.remove());
        return;
      }
    });
  } catch (error) {
    console.error("isCollision error: ", error);
  }
}

//model
function animateBackground(container: HTMLElement) {
  try {
    if (!run) return;
    offset -= scrollSpeed;
    container.style.backgroundPositionX = `${offset}px`;
    requestAnimationFrame(() => animateBackground(container));
  } catch (error) {
    console.error("animateBackground error: ", error);
  }
}

function gameOver(hyrax: Hyrax, container: HTMLElement) {
  try {
    offset = 0;
    hyrax.htmlElement.style.animation = "none";
    container.style.animation = "none";
    console.log("Game Over! Score:", hyrax.score);
    container.style.opacity = "20%";
    const gameOverDiv = document.getElementById("game-over");
    if (!gameOverDiv) throw new Error("game-over element not found");
    gameOverDiv.style.display = "flex";
    // CHANGED: use hyrax.score instead of this.score; reason: 'this' here is not Hyrax
    if (hyrax.score > maxScore) {
      maxScore = hyrax.score;
      localStorage.setItem("maxscore", JSON.stringify(maxScore));
    }
    renderMaxScore(); // ADDED: keep both top and overlay max score in sync
  } catch (error) {
    console.error(error);
  }
}

// ADDED: restart logic to satisfy "restart the game" requirement
function restartGame() {
  try {
    if (!containerRef || !hyraxRef) return;
    // reset state
    run = true; // reason: resume loops that check this flag
    offset = 0; // reason: reset background position
    hyraxRef.isDead = false; // reason: allow new collisions
    hyraxRef.isJump = false; // reason: ensure jump state clean
    hyraxRef.score = 0; // reason: new run starts at 0
    renderScore(hyraxRef);

    // reset visuals
    containerRef.style.opacity = "100%"; // reason: restore normal view
    hyraxRef.htmlElement.style.bottom = `${hyraxHeight}%`; // reason: ensure position baseline
    hyraxRef.htmlElement.style.animation = "run-cycle 0.3s steps(4) infinite"; // reason: resume running anim

    // hide overlay
    const gameOverDiv = document.getElementById("game-over");
    if (gameOverDiv) gameOverDiv.style.display = "none";

    // remove any leftover cacti just in case
    document.querySelectorAll(".cactus").forEach((c) => c.remove());

    // restart loops
    animateBackground(containerRef);
    updateCactus(containerRef);
    startCollisionDetection(hyraxRef, containerRef);

    // keep max score visible (no change needed, but call to be explicit)
    renderMaxScore();
  } catch (error) {
    console.error("restartGame error: ", error);
  }
}
