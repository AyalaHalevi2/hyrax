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
//data
var offset = 0;
var jumpDuration = 500; // ms (smoother)
var scrollSpeed = 4;
var jumpHeight = 20; // px (higher)
var hyraxHeight = 30; // %
var run = true;
var score = sessionStorage.getItem("score") ? JSON.parse(sessionStorage.getItem("score")) : 0;
var maxScore = localStorage.getItem("maxscore") ? JSON.parse(localStorage.getItem("maxscore")) : 0;
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
//control functions
window.addEventListener("DOMContentLoaded", function () {
    try {
        var container = document.getElementById("game-container");
        if (!container)
            throw new Error("game-container element not found");
        animateBackground(container);
        updateCactus(container);
        var hyraxInHTML = document.getElementById("hyrax-runner");
        if (!hyraxInHTML)
            throw new Error("hyrax-runner element not found");
        var hyrax_1 = new Hyrax(hyraxInHTML);
        startCollisionDetection(hyrax_1, container);
        document.addEventListener("keydown", function (e) {
            if (e.code === "Space" || e.code === "ArrowUp")
                hyrax_1.jump();
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
function animateBackground(container) {
    try {
        offset -= scrollSpeed;
        container.style.backgroundPositionX = offset + "px";
        requestAnimationFrame(function () { return animateBackground(container); });
    }
    catch (error) {
        console.error("animateBackground error: ", error);
    }
}
function updateCactus(container) {
    try {
        if (!run)
            return;
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
        }, 3000);
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
            var isOverlapping = hyraxLeft < cactusRight && hyraxRight > cactusLeft && hyraxTop < cactusBottom && hyraxBottom > cactusTop;
            var hyraxCenter = hyraxRect_1.left + hyraxRect_1.width / 2;
            var cactusCenter = cactusRect.left + cactusRect.width / 2;
            if (hyraxCenter > cactusCenter && !isOverlapping && hyrax.isJump) {
                setTimeout(function () {
                    score += 100; // Award 100 points for successful jump
                    renderScore();
                });
                console.log("Successful jump! +100 points");
            }
            if (isOverlapping && !hyrax.isDead) {
                console.log("Collision detected!");
                hyrax.die();
                hyrax.htmlElement.style.animation = "none";
                offset = 0;
                container.style.animation = "none";
                cactusElements_1.forEach(function (cactus) {
                    cactus.style.animation = "none";
                    cactus.style.animationPlayState = "paused";
                });
                return;
            }
        });
    }
    catch (error) {
        console.error("isCollision error: ", error);
    }
}
