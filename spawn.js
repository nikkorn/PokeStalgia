/**
 * A spawned pokemon.
 */
function Spawn(id, level, target) {
    var sprite;
    var spriteContainer;
    var captureBar;

    var init = function () {
        createPokemonSprite();

        spriteContainer = document.createElement("DIV");
        spriteContainer.className = "spawn-container";

        spriteContainer.appendChild(sprite);
        target.appendChild(spriteContainer);

        sprite.addEventListener("mousedown", onCaptureAttempt);
        sprite.addEventListener("mouseover", showCaptureBar);
        sprite.addEventListener("mouseout", hideCaptureBar);
    };

    var createPokemonSprite = function () {
        sprite = document.createElement("IMG");

        if (typeof pokemon !== "undefined" && pokemon[id - 1]) {
            sprite.setAttribute("title", pokemon[id - 1].name + " :L" + level);
        }

        var spriteURL = chrome.runtime.getURL("resources/sprites/" + id + ".png");
        sprite.setAttribute("src", spriteURL);
    };

    var onCaptureAttempt = function () {
        if (captureBar && captureBar.isInCapturePosition()) {
            chrome.runtime.sendMessage(
                { action: "onCatch", pokemonId: id, pokemonLevel: level },
                function () {
                    if (chrome.runtime.lastError) {
                        return;
                    }

                    if (target.contains(spriteContainer)) {
                        target.removeChild(spriteContainer);
                    }

                    hideCaptureBar();
                }
            );
        }
    };

    var showCaptureBar = function () {
        captureBar = new CaptureBar("easy");
        spriteContainer.appendChild(captureBar.getCaptureBarElement());
        captureBar.startPointerTick();
    };

    var hideCaptureBar = function () {
        if (captureBar) {
            if (spriteContainer.contains(captureBar.getCaptureBarElement())) {
                spriteContainer.removeChild(captureBar.getCaptureBarElement());
            }
            captureBar.stopPointerTick();
            captureBar = null;
        }
    };

    init();
}
