var container = document.getElementById("game-container");
var hyrax = document.getElementById("hyrax-runner");
var offset = 0;
var scrollSpeed = 1;
var jumpHeight = 120;
var jumpDuration = 500;
var isJumping = false;
function animateBackground() {
    offset -= scrollSpeed;
    container.style.backgroundPositionX = offset + "px";
    requestAnimationFrame(animateBackground);
}
function jump() {
    if (isJumping)
        return;
    isJumping = true;
    var computedStyle = window.getComputedStyle(hyrax);
    var currentFrame = computedStyle.backgroundPositionX;
    hyrax.style.animation = "none";
    hyrax.style.backgroundPositionX = currentFrame;
    hyrax.style.transition = "bottom " + jumpDuration / 2 + "ms ease-out";
    hyrax.style.bottom = 222 + jumpHeight + "px";
    setTimeout(function () {
        hyrax.style.transition = "bottom " + jumpDuration / 2 + "ms ease-in";
        hyrax.style.bottom = "222px";
        setTimeout(function () {
            hyrax.style.animation = "run-cycle 0.3s steps(4) infinite";
            isJumping = false;
        }, jumpDuration / 2);
    }, jumpDuration / 2);
}
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        jump();
    }
});
animateBackground();
