import { Application, Assets, Container, Renderer } from "pixi.js";
import { backgroundSize, gameState, gameEvents } from "./constants";
import { Scene } from "./types";
import { MainScene } from "./scenes/MainScene";

export let globalScale: number = 1;
export let gameSize = {
  width: backgroundSize.width,
  height: backgroundSize.height,
};

export class Game {
  _app: Application<Renderer>;
  world: Container;
  scene?: Scene;

  constructor(app: Application<Renderer>) {
    this._app = app;
    this.world = new Container();
    app.stage.addChild(this.world);
  }

  async run(): Promise<void> {
    const app = this._app;
    const world = this.world;

    // Load assets
    await Assets.load("/assets/flappy-bird-atlas.json");

    // Calculate device specific values
    globalScale = app.screen.height / backgroundSize.height;
    gameSize = {
      width: app.screen.width / globalScale,
      height: app.screen.height / globalScale,
    };

    // Input
    world.eventMode = "static";
    world.on("pointerdown", () => {
      if (gameState.current === "waiting") {
        gameState.current = "playing";
        gameEvents.emit("gameStart");
      }
      gameEvents.emit("tap");
    });

    // Load scene
    this.scene = new MainScene();
    world.addChild(this.scene.load());
    world.scale.set(globalScale);

    // Subscribe to events
    gameEvents.on("replay", () => this.onReplay());

    // Update loop
    app.ticker.add((time) => {
      const deltaTime = time.deltaTime / 60;
      if (this.scene) {
        this.scene.update(deltaTime);
      }
    });
  }

  onReplay(): void {
    // Reset game state
    gameState.current = "waiting";
    gameState.score = 0;

    if (this.scene) {
      this.scene.unload();
      this.world.addChild(this.scene.load());
    }
  }
}
