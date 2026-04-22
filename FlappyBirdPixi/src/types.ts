import { Container } from "pixi.js";

export type GameState = "waiting" | "playing" | "game_over";

export interface Entity {
  update(delta: number): void;
  destroy(): void;
}

export interface Scene {
  load(): Container;
  unload(): void;
  update(deltaTime: number): void;
}

export interface Overlappable {
  boxWidth: number;
  boxHeight: number;
  boxOffset: {
    x: number;
    y: number;
  };
}

export type EventCallback = () => void;
export type EventTypes = "gameStart" | "tap" | "gameOver" | "score" | "replay";

export class GameEvent {
  _listeners: Record<EventTypes, EventCallback[]> = {
    gameStart: [],
    gameOver: [],
    score: [],
    replay: [],
    tap: [],
  };

  on(event: EventTypes, callback: EventCallback) {
    (this._listeners[event] ??= []).push(callback);
  }

  off(event: EventTypes, callback: EventCallback) {
    this._listeners[event] = this._listeners[event].filter(
      (cb) => cb !== callback,
    );
  }

  emit(event: EventTypes) {
    this._listeners[event]?.forEach((callback) => callback());
  }
}
