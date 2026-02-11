/**
 * The capture bar of a spawned pokemon.
 */
function CaptureBar(difficulty) {
    var pointerPosition = 1;
    var isPointerActive = false;
    var captureBarElement;
    var captureBarPointerElement;
    var pointerMovementUnit;
    var animationFrameId;

    var init = function () {
        createCaptureBar();
    };

    var createCaptureBar = function () {
        console.log(difficulty);
        
        captureBarElement = document.createElement("div");
        captureBarElement.className = "capture-bar-container";
        captureBarElement.style.position = "relative";
        captureBarElement.style.overflow = "hidden";
        captureBarElement.style.width = "40px";
        captureBarElement.style.height = "15px";
        captureBarElement.style.backgroundImage = "url(" + chrome.runtime.getURL(`resources/capture_bar_${difficulty}.png`) + ")";
        captureBarElement.style.backgroundRepeat = "no-repeat";
        captureBarElement.style.backgroundSize = "contain";

        captureBarPointerElement = document.createElement("img");
        captureBarPointerElement.className = "capture-bar-pointer";
        captureBarPointerElement.style.position = "absolute";
        captureBarPointerElement.style.left = "0px";
        captureBarPointerElement.style.top = "0px";

        try {
            captureBarPointerElement.src =
                chrome.runtime.getURL("resources/capture_bar_pointer.png");
            captureBarElement.appendChild(captureBarPointerElement);
        } catch (e) {
            return;
        }
    };

    var tick = function () {
        if (!isPointerActive)
            return;

        var barWidth = captureBarElement.offsetWidth;
        var pointerWidth = captureBarPointerElement.offsetWidth;

        if (!barWidth || !pointerWidth) {
            animationFrameId = requestAnimationFrame(tick);
            return;
        }

        if (!pointerMovementUnit) {
            pointerMovementUnit = (barWidth - pointerWidth) / 50;
        }

        pointerPosition = (pointerPosition === 50)
            ? 1
            : pointerPosition + 1;

        var newLeft = pointerPosition * pointerMovementUnit;

        // Clamp inside bounds
        if (newLeft < 0)
            newLeft = 0;

        if (newLeft > barWidth - pointerWidth)
            newLeft = barWidth - pointerWidth;

        captureBarPointerElement.style.left = newLeft + "px";

        animationFrameId = requestAnimationFrame(tick);
    };

    this.isInCapturePosition = function () {
        switch (difficulty) {
            case "easy":
                return pointerPosition >= 35;
            case "medium":
                return pointerPosition >= 40;
            case "hard":
                return pointerPosition >= 45;
            default:
                return false;
        }
    };

    this.startPointerTick = function () {
        isPointerActive = true;
        pointerMovementUnit = null;
        tick();
    };

    this.stopPointerTick = function () {
        isPointerActive = false;
        if (animationFrameId)
            cancelAnimationFrame(animationFrameId);
    };

    this.getCaptureBarElement = function () {
        return captureBarElement;
    };

    init();
};
