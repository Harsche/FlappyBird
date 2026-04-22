import { Container, Sprite, Texture } from "pixi.js";
import { Scene } from "../types";
import { Bird } from "../entities/Bird";
import { UI } from "../entities/UI";
import { Pipe } from "../entities/Pipe";
import {
  backgroundSize,
  maxPipeY,
  minPipeY,
  pipesDistanceX,
} from "../constants";
import { overlaps } from "../utils/physics";
import { ScoreTrigger } from "../entities/ScoreTrigger";
import { gameSize } from "../Game";

export class MainScene implements Scene {
  root?: Container;
  pipes: Pipe[] = [];
  scores: ScoreTrigger[] = [];
  bird?: Bird;
  isLoaded = false;

  load(): Container {
    this.root = new Container();
    const root = this.root;

    // Background
    const backgrounds: Sprite[] = [];
    backgrounds.length = Math.ceil(gameSize.width / backgroundSize.width);
    const backgroundTexture = Texture.from("sprites/background-day.png");
    for (let i = 0; i < backgrounds.length; i++) {
      const background = new Sprite(backgroundTexture);
      background.position.x = backgroundSize.width * i;
      backgrounds[i] = background;
      root.addChild(background);
    }

    // Bird (player)
    this.bird = new Bird();
    root.addChild(this.bird);

    // Pipes
    this.spawnPipesAndScores();

    // UI
    const ui = new UI();
    root.addChild(ui);

    this.isLoaded = true;

    return root;
  }

  unload(): void {
    if (!this.isLoaded) {
      return;
    }

    this.pipes.length = 0;
    this.scores.length = 0;

    if (this.root) {
      this.root.removeFromParent();
      this.root.destroy({ children: true });
    }

    this.isLoaded = false;
  }

  update(deltaTime: number): void {
    if (!this.isLoaded) {
      return;
    }

    if (!this.bird) {
      return;
    }

    const bird = this.bird;

    bird.update(deltaTime);

    this.pipes.forEach((pipe) => {
      pipe.update(deltaTime);
      if (overlaps(bird, pipe)) {
        bird.onPipeCollide();
      }
    });

    this.scores.forEach((score) => {
      score.update(deltaTime);
      if (overlaps(bird, score)) {
        bird.onScoreCollide(score);
      }
    });
  }

  spawnPipesAndScores(): void {
    if (!this.root) {
      throw Error("Spawn should only be called when a root container exists.");
    }

    const root = this.root;

    const pipePosition = { x: gameSize.width, y: 0 };
    const pipeCount = Math.ceil(gameSize.width / pipesDistanceX);
    Pipe.pipeCount = pipeCount;
    for (let i = 0; i < pipeCount; i++) {
      // Pipes
      pipePosition.y = minPipeY + Math.random() * (maxPipeY - minPipeY);
      const pipeTop: Pipe = new Pipe(pipePosition.x, pipePosition.y, true);
      const pipeBottom: Pipe = new Pipe(pipePosition.x, pipePosition.y, false);

      root.addChild(pipeTop);
      root.addChild(pipeBottom);
      this.pipes.push(pipeTop);
      this.pipes.push(pipeBottom);

      // Scores
      const score = new ScoreTrigger(pipePosition.x, pipePosition.y);
      this.scores.push(score);
      root.addChild(score);

      // Advance position
      pipePosition.x += pipesDistanceX;
    }
  }
}
