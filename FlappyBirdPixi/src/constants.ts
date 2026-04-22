import { GameEvent, GameState } from "./types";

// General
export const gameUnit = 60;
export const backgroundSize = { width: 288, height: 512 };
export const gameState = {
  current: "waiting" as GameState,
  score: 0,
};
export const gameEvents = new GameEvent();
export const pipeHeight: number = 320;

/* ----------------------------------------------------- DESIGN ----------------------------------------------------- */

// Bird
export const gravity: number = 9.8 * gameUnit;
export const tapStrength: number = -8 * gameUnit;

// Pipes
export const pipeSpeed: number = -120;
export const pipesDistanceX: number = 220;
export const pipesDistanceY: number = 130;
export const minPipeY: number = 64;
export const maxPipeY: number = backgroundSize.height - pipesDistanceY - 64;

// Development
export const debug: boolean = false;
