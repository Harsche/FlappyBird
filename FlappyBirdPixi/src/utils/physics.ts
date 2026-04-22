import { Container } from "pixi.js";
import { Overlappable } from "../types";

export function overlaps(
  a: Overlappable & Container,
  b: Overlappable & Container,
): boolean {
  const aPos = {
    x: a.x + a.boxOffset.x,
    y: a.y + a.boxOffset.y,
  };

  const bPos = {
    x: b.x + b.boxOffset.x,
    y: b.y + b.boxOffset.y,
  };

  return (
    aPos.x < bPos.x + b.boxWidth &&
    aPos.x + a.boxWidth > bPos.x &&
    aPos.y < bPos.y + b.boxHeight &&
    aPos.y + a.boxHeight > bPos.y
  );
}
