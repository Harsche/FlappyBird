import { Container, Graphics } from "pixi.js";
import { Entity, Overlappable } from "../types";
import {
  debug,
  gameState,
  pipesDistanceX,
  pipesDistanceY,
  pipeSpeed,
} from "../constants";
import { Pipe } from "./Pipe";

export class ScoreTrigger extends Container implements Entity, Overlappable {
  boxWidth: number;
  boxHeight: number;
  boxOffset: { x: number; y: number };

  constructor(x: number, y: number) {
    super();

    // Collision
    this.boxWidth = 20;
    this.boxHeight = pipesDistanceY;
    this.boxOffset = { x: 20, y: 0 };

    // Position
    this.position.set(x, y);

    if (debug) {
      // Debug
      const debugRect = new Graphics();
      debugRect
        .rect(this.boxOffset.x, this.boxOffset.y, this.boxWidth, this.boxHeight)
        .stroke({ width: 2, color: 0x0000ff });

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
