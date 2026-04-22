import { Container, DestroyOptions, Sprite, Text, Texture } from "pixi.js";
import { gameEvents, backgroundSize, gameState } from "../constants";
import { gameSize, globalScale } from "../Game";

export class UI extends Container {
  _text: Text = new Text();
  _message: Sprite = new Sprite();
  _gameOver: Sprite = new Sprite();
  _playButton: Sprite = new Sprite();

  constructor() {
    super();
    this._message.texture = Texture.from("sprites/message.png");
    this._gameOver.texture = Texture.from("sprites/gameover.png");
    this._playButton.texture = Texture.from("sprites/play-button.png");

    this._message.anchor.set(0.5);
    this._message.position.set(
      gameSize.width / 2,
      backgroundSize.height / 2 - 100,
    );
    this.addChild(this._message);

    gameEvents.on("gameStart", this._onGameStart);
    gameEvents.on("score", this._onScore);
    gameEvents.on("gameOver", this._onGameOver);
  }

  destroy(_options?: DestroyOptions): void {
    gameEvents.off("gameStart", this._onGameStart);
    gameEvents.off("gameOver", this._onGameOver);
    gameEvents.off("score", this._onScore);
    super.destroy(_options);
  }

  private _onGameStart = () => {
    this.removeChild(this._message);

    this._text.text = "0";
    this._text.style = {
      fill: "#ffffff",
      stroke: {
        color: "#000000",
        width: 4,
      },
    };
    this._text.position.set(gameSize.width / 2, 20);
    this.addChild(this._text);
  };

  private _onScore = () => {
    this._text.text = gameState.score;
  };

  private _onGameOver = () => {
    // Game Over text
    this._gameOver.anchor.set(0.5);
    this._gameOver.position.set(
      gameSize.width / 2,
      backgroundSize.height / 2 - 60,
    );
    this.addChild(this._gameOver);

    // Play Button
    this._playButton.anchor.set(0.5);
    this._playButton.position.set(
      gameSize.width / 2,
      backgroundSize.height / 2 + 60,
    );
    this._playButton.scale.set(globalScale);
    this.addChild(this._playButton);
    this._playButton.eventMode = "static";
    this._playButton.on("click", () => {
      gameEvents.emit("replay");
    });
  };
}
