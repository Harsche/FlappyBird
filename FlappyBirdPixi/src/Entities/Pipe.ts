import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Entity, Overlappable } from "../types";
import {
  debug,
  gameState,
  pipeHeight,
  pipesDistanceX,
  pipesDistanceY,
  pipeSpeed,
} from "../constants";

export class Pipe extends Container implements Entity, Overlappable {
  boxWidth: number;
  boxHeight: number;
  boxOffset: { x: number; y: number };
  static pipeCount: number = 3;

  constructor(x: number, y: number, isTop: boolean) {
    super();

    // Texture
    const pipeSprite = new Sprite(Texture.from("sprites/pipe-green.png"));
    this.addChild(pipeSprite);

    // Collision
    this.boxWidth = this.width;
    this.boxHeight = this.height;
    this.boxOffset = { x: 0, y: 0 };

    // Position
    if (isTop) {
      pipeSprite.scale.set(1, -1);
      this.boxOffset.y -= pipeHeight;
    } else {
      y += pipesDistanceY;
    }
    this.position.set(x, y);

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
    if (gameState.current !== "playing") {
      return;
    }

    let xPos = this.position.x;
    xPos += pipeSpeed * delta;
    this.position.x = xPos;

    if (this.position.x + this.width < 0) {
      this.position.x += pipesDistanceX * Pipe.pipeCount;
    }
  }
}
