import { Container, DestroyOptions, Graphics, Sprite, Texture } from "pixi.js";
import { Entity, Overlappable } from "../types";
import { clamp } from "../utils/math";
import {
  debug,
  gameEvents,
  backgroundSize,
  gameState,
  gravity,
  tapStrength,
} from "../constants";

export class Bird extends Sprite implements Entity, Overlappable {
  velocity: number = 0;
  gravityScale: number = 2.5;
  frames: Texture[];
  time: number = 0;
  collisionObj?: Container;

  boxWidth: number;
  boxHeight: number;
  boxOffset: { x: number; y: number };

  constructor() {
    super();

    this.position.set(40, backgroundSize.height / 2);

    this.frames = [
      Texture.from("sprites/yellowbird-midflap.png"),
      Texture.from("sprites/yellowbird-downflap.png"),
      Texture.from("sprites/yellowbird-midflap.png"),
      Texture.from("sprites/yellowbird-upflap.png"),
    ];
    this.texture = this.frames[0];

    this.boxWidth = 26;
    this.boxHeight = 20;
    this.boxOffset = { x: 4, y: 2 };
    this.zIndex = 1;

    gameEvents.on("tap", this._onTap);

    if (debug) {
      // Debug
      const debugRect = new Graphics();
      debugRect
        .rect(this.boxOffset.x, this.boxOffset.y, this.boxWidth, this.boxHeight)
        .stroke({ width: 2, color: 0xff0000 });

      this.addChild(debugRect);
    }
  }

  update(delta: number): void {
    // Animation
    let positionY = this.position.y;

    if (gameState.current !== "game_over") {
      this.time += delta;
      this.texture = this.frames[Math.floor(this.time * 12) % 4];
    }

    // Physics
    if (gameState.current !== "waiting") {
      this.velocity += gravity * this.gravityScale * delta;
      positionY += this.velocity * delta;
      positionY = clamp(positionY, 0, backgroundSize.height - this.height);
    }

    if (positionY === 0) {
      this.velocity = 0;
    }

    this.position.y = positionY;
  }

  destroy(_options?: DestroyOptions): void {
    gameEvents.off("tap", this._onTap);
    super.destroy(_options);
  }

  private _onTap = () => {
    if (gameState.current === "playing") {
      this.velocity = tapStrength;
    }
  };

  onPipeCollide(): void {
    if (gameState.current === "game_over") {
      return;
    }

    this.velocity = 0;
    gameEvents.emit("gameOver");
    gameState.current = "game_over";
  }

  onScoreCollide(scoreObj: Container): void {
    if (scoreObj === this.collisionObj) {
      return;
    }

    this.collisionObj = scoreObj;

    gameState.score++;
    gameEvents.emit("score");
  }
}
