var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var offset = 0;
var jumpDuration = 400;
var scrollSpeed = 4;
var jumpHeight = 30;
var hyraxHeight = 30;
var run = true;
var maxScore = localStorage.getItem("maxscore")
    ? JSON.parse(localStorage.getItem("maxscore"))
    : 0;
// ADDED: keep references so we can restart without reloading the page
var hyraxRef = null; // reason: needed by restart to reset score/animation
var containerRef = null; // reason: needed by restart to re-run loops
var Hyrax = /** @class */ (function () {
    function Hyrax(elment) {
        this.htmlElement = elment;
        this.position = { x: 0, y: 0 };
        this.isJump = false;
        this.isSlide = false;
        this.isDead = false; // CHANGED: explicitly initialize; reason: used during restart/collision
        this.score = 0;
        renderScore(this);
    }
    //model
    Hyrax.prototype.jump = function () {
        var _this = this;
        if (this.isJump || !run)
            return;
        this.isJump = true;
        // freeze current sprite frame during jump
        var computedStyle = window.getComputedStyle(this.htmlElement);
        var currentFrame = computedStyle.backgroundPositionX;
        this.htmlElement.style.animation = "none";
        this.htmlElement.style.backgroundPositionX = currentFrame;
        this.htmlElement.style.transition = "bottom " + jumpDuration + "ms ease-out";
        this.htmlElement.style.bottom = hyraxHeight + jumpHeight + "%";
        setTimeout(function () {
            _this.htmlElement.style.transition = "bottom " + jumpDuration + "ms ease-in";
            _this.htmlElement.style.bottom = hyraxHeight + "%";
            setTimeout(function () {
                _this.htmlElement.style.animation = "run-cycle 0.3s steps(4) infinite";
                _this.isJump = false;
                console.log("after jumping: " + offset);
            }, jumpDuration);
        }, jumpDuration);
    };
    return Hyrax;
}());
//data
var Obstacle = /** @class */ (function () {
    function Obstacle() {
        this.position = { x: 0, y: 0 };
    }
    return Obstacle;
}());
var Cactus = /** @class */ (function (_super) {
    __extends(Cactus, _super);
    function Cactus() {
        var _this = _super.call(this) || this;
        _this.position.y = 30;
        _this.renderCactus();
        return _this;
    }
    //view
    Cactus.prototype.renderCactus = function () {
        try {
            if (!run)
                return;
            var cactusContainer = document.getElementById("cactusRoot");
            if (!cactusContainer)
                throw new Error("cactusRoot element not found");
            this.htmlElement = document.createElement("div");
            this.htmlElement.className = "cactus";
            cactusContainer.appendChild(this.htmlElement);
            this.htmlElement = this.htmlElement;
        }
        catch (error) {
            console.error(error);
        }
    };
    return Cactus;
}(Obstacle));
//view
function renderScore(hyrax) {
    try {
        var scoreinhtml = document.getElementById("scoreRoot");
        if (!scoreinhtml)
            throw new Error("scoreRoot not found");
        sessionStorage.setItem("score", JSON.stringify(hyrax.score));
        scoreinhtml.innerHTML = hyrax.score.toString();
    }
    catch (error) {
        console.error("renderScore error: ", error);
    }
}
// ADDED: render max score in both the top bar and the game-over overlay
function renderMaxScore() {
    try {
        var topMax = document.getElementById("maxscoreRoot");
        if (topMax)
            topMax.textContent = String(maxScore); // reason: keep top bar always showing current max
        var overlayMax = document.getElementById("maxscoreOverlay");
        if (overlayMax)
            overlayMax.textContent = String(maxScore); // reason: replace placeholder with real max score
    }
    catch (error) {
        console.error("renderMaxScore error: ", error);
    }
}
//control functions
window.addEventListener("DOMContentLoaded", function () {
    try {
        var container = document.getElementById("game-container");
        if (!container)
            throw new Error("game-container element not found");
        containerRef = container; // ADDED: save for restart
        animateBackground(container);
        updateCactus(container);
        var hyraxInHTML = document.getElementById("hyrax-runner");
        if (!hyraxInHTML)
            throw new Error("hyrax-runner element not found");
        var hyrax_1 = new Hyrax(hyraxInHTML);
        hyraxRef = hyrax_1; // ADDED: save for restart
        startCollisionDetection(hyrax_1, container);
        document.addEventListener("keydown", function (e) {
            if (e.code === "Space" || e.code === "ArrowUp")
                hyrax_1.jump();
        });
        renderMaxScore(); // ADDED: show max on initial load
        // ADDED: hook up restart button to reset state and resume loops
        var restartBtn = document.getElementById("restartBtn");
        if (restartBtn) {
            restartBtn.addEventListener("click", function () {
                // reason: user requested a restart button that restarts the game
                restartGame();
            });
        }
    }
    catch (error) {
        console.error("Event error: ", error);
    }
});
function updateCactus(container) {
    try {
        var frames_1 = container.clientWidth / scrollSpeed;
        var addCactusInterval_1 = setInterval(function () {
            if (!run) {
                clearInterval(addCactusInterval_1);
                return;
            }
            var rendonAdditionalTime = Math.floor(Math.random() * 5) * 50;
            setTimeout(function () {
                var cactus = new Cactus();
                cactus.htmlElement.style.animation = "cactus-movement " + frames_1 / 60 + "s linear forwards";
                setTimeout(function () {
                    if (cactus.htmlElement && cactus.htmlElement.parentNode) {
                        cactus.htmlElement.parentNode.removeChild(cactus.htmlElement);
                    }
                }, (frames_1 / 60) * 1000);
            }, rendonAdditionalTime);
        }, 2500);
    }
    catch (error) {
        console.error("Error moving cactus: ", error);
    }
}
function startCollisionDetection(hyrax, container) {
    try {
        var collisionInterval_1 = setInterval(function () {
            if (!run) {
                clearInterval(collisionInterval_1);
                return;
            }
            var hyraxElement = document.getElementById("hyrax-runner");
            if (!hyraxElement)
                return;
            isCollision(hyrax, container);
        }, 10);
    }
    catch (error) {
        console.error("startCollisionDetection error: ", error);
    }
}
//control
function isCollision(hyrax, container) {
    try {
        var cactusElements_1 = document.querySelectorAll(".cactus");
        if (!cactusElements_1)
            throw new Error("no cactus class element");
        var hyraxRect_1 = hyrax.htmlElement.getBoundingClientRect();
        cactusElements_1.forEach(function (cactusElement) {
            var cactusRect = cactusElement.getBoundingClientRect();
            var margin = 10;
            var hyraxLeft = hyraxRect_1.left + margin;
            var hyraxRight = hyraxRect_1.right - margin;
            var hyraxTop = hyraxRect_1.top + margin;
            var hyraxBottom = hyraxRect_1.bottom - margin;
            var cactusLeft = cactusRect.left;
            var cactusRight = cactusRect.right;
            var cactusTop = cactusRect.top;
            var cactusBottom = cactusRect.bottom;
            var isOverlapping = hyraxLeft < cactusRight &&
                hyraxRight > cactusLeft &&
                hyraxTop < cactusBottom &&
                hyraxBottom > cactusTop;
            var hyraxCenter = hyraxRect_1.left + hyraxRect_1.width / 2;
            var cactusCenter = cactusRect.left + cactusRect.width / 2;
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
                cactusElements_1.forEach(function (cactus) { return cactus.remove(); });
                return;
            }
        });
    }
    catch (error) {
        console.error("isCollision error: ", error);
    }
}
//model
function animateBackground(container) {
    try {
        if (!run)
            return;
        offset -= scrollSpeed;
        container.style.backgroundPositionX = offset + "px";
        requestAnimationFrame(function () { return animateBackground(container); });
    }
    catch (error) {
        console.error("animateBackground error: ", error);
    }
}
function gameOver(hyrax, container) {
    try {
        offset = 0;
        hyrax.htmlElement.style.animation = "none";
        container.style.animation = "none";
        console.log("Game Over! Score:", hyrax.score);
        container.style.opacity = "20%";
        var gameOverDiv = document.getElementById("game-over");
        if (!gameOverDiv)
            throw new Error("game-over element not found");
        gameOverDiv.style.display = "flex";
        // CHANGED: use hyrax.score instead of this.score; reason: 'this' here is not Hyrax
        if (hyrax.score > maxScore) {
            maxScore = hyrax.score;
            localStorage.setItem("maxscore", JSON.stringify(maxScore));
        }
        renderMaxScore(); // ADDED: keep both top and overlay max score in sync
    }
    catch (error) {
        console.error(error);
    }
}
// ADDED: restart logic to satisfy "restart the game" requirement
function restartGame() {
    try {
        if (!containerRef || !hyraxRef)
            return;
        // reset state
        run = true; // reason: resume loops that check this flag
        offset = 0; // reason: reset background position
        hyraxRef.isDead = false; // reason: allow new collisions
        hyraxRef.isJump = false; // reason: ensure jump state clean
        hyraxRef.score = 0; // reason: new run starts at 0
        renderScore(hyraxRef);
        // reset visuals
        containerRef.style.opacity = "100%"; // reason: restore normal view
        hyraxRef.htmlElement.style.bottom = hyraxHeight + "%"; // reason: ensure position baseline
        hyraxRef.htmlElement.style.animation = "run-cycle 0.3s steps(4) infinite"; // reason: resume running anim
        // hide overlay
        var gameOverDiv = document.getElementById("game-over");
        if (gameOverDiv)
            gameOverDiv.style.display = "none";
        // remove any leftover cacti just in case
        document.querySelectorAll(".cactus").forEach(function (c) { return c.remove(); });
        // restart loops
        animateBackground(containerRef);
        updateCactus(containerRef);
        startCollisionDetection(hyraxRef, containerRef);
        // keep max score visible (no change needed, but call to be explicit)
        renderMaxScore();
    }
    catch (error) {
        console.error("restartGame error: ", error);
    }
}
