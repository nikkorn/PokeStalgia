// Load dependent scripts (required in Manifest V3)
importScripts("pokemon.js", "pokemongenerator.js", "pokedexrepository.js");

// The pokedex repository.
var repository = new PokedexRepository();

// The pokemon generator.
var pokemonGenerator = new PokemonGenerator(repository);

/**
 * Listen for tab loaded events.
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { action: "tabLoad" }, function () {
      if (chrome.runtime.lastError) {
        // No content script in this tab — ignore
        return;
      }
    });
  }
});

/**
 * Listen for messages from other scripts.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // A pokemon was seen and caught.
  if (msg.action === "onCatchSuccess") {
    repository.addCaughtPokemon(msg.pokemonId, msg.pokemonLevel);
    pokemonGenerator.populateTicketCache();
    return; // no async response
  }

  // A pokemon was seen but not caught.
  if (msg.action === "onCatchFail") {
    // TODO Add a "seen" state for pokemon.
    return; // no async response
  }

  // Popup requests pokedex data
  if (msg.action === "pokedexDataRequest") {
    sendResponse({
      // ⚠️ Make sure this exists in pokemon.js
      pokemon: typeof pokemon !== "undefined" ? pokemon : [],
      captureInfo: repository.getAllCaughtPokemonDetails(),
      trainerLevel: repository.getTrainerLevel(),
      owned: repository.getOwnedCount(),
    });
    return; // synchronous response
  }

  // Request random pokemon draw
  if (msg.action === "requestPokemonDraw") {
    sendResponse(pokemonGenerator.draw());
    return; // synchronous response
  }
});
