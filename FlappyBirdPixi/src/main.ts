import { Application, TextureSource } from "pixi.js";
import { Game } from "./Game";

function applyGlobalSettings() {
  TextureSource.defaultOptions.scaleMode = "nearest";
}

(async () => {
  // Create a new application
  const app = new Application();

  await app.init({
    background: "#4dc1cb",
    resizeTo: window,
    roundPixels: true,
  });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  applyGlobalSettings();

  const game = new Game(app);
  await game.run();
})();
