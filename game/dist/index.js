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
var scrollSpeed = 1;
var jumpHeight = 20; //
var hyraxHeight = 30; //%
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
            }, jumpDuration);
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
var Bird = /** @class */ (function (_super) {
    __extends(Bird, _super);
    function Bird() {
        var _this = _super.call(this) || this;
        _this.position.y = 30; //%
        _this.renderBird();
        return _this;
    }
    Bird.prototype.htmlBird = function () {
        return "<div class=\"bird\" style=\"bottom: " + this.position.y + "%;\"></div>";
    };
    Bird.prototype.renderBird = function () {
        try {
            var birdsContainer = document.getElementById("birdRoot");
            if (!birdsContainer)
                throw new Error("birdRoot element not found");
            // birdsContainer.textContent+=this.htmlBird()- need to replace this
        }
        catch (error) {
            console.error("Error renderBire: ");
        }
    };
    return Bird;
}(Obstacle));
window.addEventListener("DOMContentLoaded", function () {
    try {
        animateBackground();
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
        // const maxscoreinhtml = document.getElementById("maxscoreRoot");
        // if (!maxscoreinhtml) throw new Error("maxscoreRoot not found");
        // sessionStorage.setItem("maxscore", JSON.stringify(maxScore));
        // maxScore = score > maxScore ? score : maxScore;
        // localStorage.setItem("maxscore", JSON.stringify(maxScore));
        // maxscoreinhtml.innerHTML = maxScore;
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
