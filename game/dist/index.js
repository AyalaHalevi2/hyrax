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
var jumpDuration = 250; //ms
var scrollSpeed = 5;
var jumpHeight = 20; //
var hyraxHeight = 30; //%
var run = true;
var score = sessionStorage.getItem("score") ? JSON.parse(sessionStorage.getItem("score")) : 0;
var maxScore = localStorage.getItem("maxscore") ? JSON.parse(localStorage.getItem("maxscore")) : 0;
var Hyrax = /** @class */ (function () {
    function Hyrax(elment) {
        this.htmlElement = elment;
        this.posiotion = { x: 0, y: 0 };
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
        console.log("jumping: " + offset);
        var computedStyle = window.getComputedStyle(this.htmlElement);
        var currentFrame = computedStyle.backgroundPositionX;
        this.htmlElement.style.animation = "none";
        this.htmlElement.style.backgroundPositionX = currentFrame;
        this.htmlElement.style.animation = "jump 0.3s ease-in-out";
        // setTimeout(() => {
        //   this.htmlElement.style.transition = `bottom ${jumpDuration}ms ease-in`;
        //   this.htmlElement.style.bottom = `${hyraxHeight}%`;
        setTimeout(function () {
            _this.htmlElement.style.animation = "run-cycle 0.3s steps(4) infinite";
            _this.isJump = false;
            console.log("after jumping: " + offset);
        }, jumpDuration);
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
            console.error("Error renderCactus: ");
        }
    };
    return Cactus;
}(Obstacle));
window.addEventListener("DOMContentLoaded", function () {
    try {
        animateBackground();
        bla();
        var hyraxInHTML = document.getElementById("hyrax-runner");
        if (!hyraxInHTML)
            throw new Error("hyrax-runner element not found");
        var hyrax_1 = new Hyrax(hyraxInHTML);
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
        scoreinhtml.innerHTML = score;
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
function bla() {
    try {
        var container = document.getElementById("game-container");
        if (!container)
            throw new Error("game-container element not found");
        var frames_1 = container.clientWidth / scrollSpeed;
        setInterval(function () {
            var a = Math.floor(Math.random() * 10) * 50;
            console.log(a);
            setTimeout(function () {
                var cactus = new Cactus();
                cactus.htmlElement.style.animation = "cactus-movement " + frames_1 / 60 + "s linear forwards";
            }, a);
        }, 1000);
    }
    catch (error) {
        console.error("Error moving cactus: ", error);
    }
}
