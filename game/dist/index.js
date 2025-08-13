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
// index.ts
var offset = 0;
var jumpDuration = 300; // ms (smoother)
var scrollSpeed = 4;
var jumpHeight = 20; // px (higher)
var hyraxHeight = 30; // %
var run = true;
var score = sessionStorage.getItem("score")
    ? JSON.parse(sessionStorage.getItem("score"))
    : 0;
var maxScore = localStorage.getItem("maxscore")
    ? JSON.parse(localStorage.getItem("maxscore"))
    : 0;
var hyraxInstance;
var Hyrax = /** @class */ (function () {
    function Hyrax(elment) {
        this.htmlElement = elment;
        this.position = { x: 0, y: 0 };
        this.isJump = false;
        this.isDead = false;
        this.isSlide = false;
        this.score = 0;
    }
    Hyrax.prototype.jump = function () {
        var _this = this;
        if (this.isJump)
            return;
        this.isJump = true;
        // freeze current sprite frame during jump
        var computedStyle = window.getComputedStyle(this.htmlElement);
        var currentFrame = computedStyle.backgroundPositionX;
        this.htmlElement.style.animation = "none";
        this.htmlElement.style.backgroundPositionX = currentFrame;
        this.htmlElement.style.transition = "bottom " + jumpDuration + "ms ease-out";
        this.htmlElement.style.bottom = hyraxHeight + jumpHeight + "%";
        // this.htmlElement.style.animation = "jump 0.3s ease-in-out";
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
    Hyrax.prototype.die = function () {
        this.isDead = true;
        run = false;
        this.htmlElement.style.animation = "none";
        console.log("Game Over! Score:", score);
        if (score > maxScore) {
            maxScore = score;
            localStorage.setItem("maxscore", JSON.stringify(maxScore));
        }
    };
    return Hyrax;
}());
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
    Cactus.prototype.renderCactus = function () {
        try {
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
window.addEventListener("DOMContentLoaded", function () {
    try {
        animateBackground();
        updateCactus();
        startCollisionDetection();
        var hyraxInHTML = document.getElementById("hyrax-runner");
        if (!hyraxInHTML)
            throw new Error("hyrax-runner element not found");
        hyraxInstance = new Hyrax(hyraxInHTML);
        document.addEventListener("keydown", function (e) {
            if (e.code === "Space" || e.code === "ArrowUp")
                hyraxInstance.jump();
        });
    }
    catch (error) {
        console.error("Event error: ", error);
    }
});
function renderScore() {
    try {
        var scoreinhtml = document.getElementById("scoreRoot");
        if (!scoreinhtml)
            throw new Error("scoreRoot not found");
        sessionStorage.setItem("score", JSON.stringify(score));
        scoreinhtml.innerHTML = score.toString();
    }
    catch (error) {
        console.error("renderScore error: ", error);
    }
}
function animateBackground() {
    try {
        var container = document.getElementById("game-container");
        if (!container)
            throw new Error("game-container element not found");
        offset -= scrollSpeed;
        container.style.backgroundPositionX = offset + "px";
        requestAnimationFrame(animateBackground);
    }
    catch (error) {
        console.error("animateBackground error: ", error);
    }
}
function updateCactus() {
    try {
        if (!run)
            return;
        var container = document.getElementById("game-container");
        if (!container)
            throw new Error("game-container element not found");
        var frames_1 = container.clientWidth / scrollSpeed;
        setInterval(function () {
            var possibleDelays = [100, 400, 700, 1000, 1500, 2000];
            var a = possibleDelays[Math.floor(Math.random() * possibleDelays.length)];
            setTimeout(function () {
                var cactus = new Cactus();
                cactus.htmlElement.style.animation = "cactus-movement " + frames_1 / 60 + "s linear forwards";
                setTimeout(function () {
                    if (cactus.htmlElement && cactus.htmlElement.parentNode) {
                        cactus.htmlElement.parentNode.removeChild(cactus.htmlElement);
                    }
                }, (frames_1 / 60) * 1000);
            }, a);
        }, 1000);
    }
    catch (error) {
        console.error("Error moving cactus: ", error);
    }
}
function startCollisionDetection() {
    try {
        var collisionInterval_1 = setInterval(function () {
            if (!run) {
                clearInterval(collisionInterval_1);
                return;
            }
            var hyraxElement = document.getElementById("hyrax-runner");
            if (!hyraxElement)
                return;
            isCollision(hyraxElement);
        }, 10);
    }
    catch (error) {
        console.error("startCollisionDetection error: ", error);
    }
}
function isCollision(hyrax) {
    try {
        var cactusElements = document.querySelectorAll(".cactus");
        cactusElements.forEach(function (cactusElement) {
            var hyraxRect = hyrax.getBoundingClientRect();
            var cactusRect = cactusElement.getBoundingClientRect();
            var margin = 10;
            var hyraxLeft = hyraxRect.left + margin;
            var hyraxRight = hyraxRect.right - margin;
            var hyraxTop = hyraxRect.top + margin;
            var hyraxBottom = hyraxRect.bottom - margin;
            var cactusLeft = cactusRect.left;
            var cactusRight = cactusRect.right;
            var cactusTop = cactusRect.top;
            var cactusBottom = cactusRect.bottom;
            var isOverlapping = hyraxLeft < cactusRight &&
                hyraxRight > cactusLeft &&
                hyraxTop < cactusBottom &&
                hyraxBottom > cactusTop;
            if (isOverlapping && !hyraxInstance.isDead) {
                console.log("Collision detected!");
                hyraxInstance.die();
                return;
            }
        });
    }
    catch (error) {
        console.error("isCollision error: ", error);
    }
}
