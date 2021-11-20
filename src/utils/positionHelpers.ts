import { rotate } from "./rotate";
import { round } from "./round";
import { GameData, Position } from "../types";
import {
  generateDoorCollisions,
  generateWallCollisions,
} from "./generateCollisionMaps";

export enum Keys {
  Forward = "w",
  Backward = "s",
  StrafeLeft = "a",
  StrafeRight = "d",
  RotLeft = "[",
  RotRight = "]",
}

export const setCol = (pos: Position, delta: number) => ({
  ...pos,
  col: pos.col + delta,
});

export const setRow = (pos: Position, delta: number) => ({
  ...pos,
  row: pos.row + delta,
});

export const rotLeft = (gameData: GameData): GameData => {
  const newPos = {
    ...gameData.position,
    dir: (gameData.position.dir + 3) % 4,
  };
  return {
    ...gameData,
    position: newPos,
  };
};

export const rotRight = (gameData: GameData): GameData => {
  const newPos = {
    ...gameData.position,
    dir: (gameData.position.dir + 1) % 4,
  };
  return {
    ...gameData,
    position: newPos,
  };
};

export const boundPosition = (
  currPosition: Position,
  nextPosition: Position,
  currentState: GameData
): Position => {
  // User position is an integer so we add 0.5 to move the users into the middle of te tile
  const x1 = currPosition.col + 0.5;
  const y1 = currPosition.row + 0.5;
  const x2 = nextPosition.col + 0.5;
  const y2 = nextPosition.row + 0.5;
  // Find center point of the move vector
  const Cx = (x1 + x2) / 2;
  const Cy = (y1 + y2) / 2;
  const By = 90;
  // Rotate those points 90 degrees to get the possible vector of the wall
  const [x1w, y1w] = rotate(x1, y1, Cx, Cy, By);
  const [x2w, y2w] = rotate(x2, y2, Cx, Cy, By);

  const doorsDict = generateDoorCollisions(currentState.doors);
  const wallsDict = generateWallCollisions(currentState.walls);

  if (wallsDict[`${round(x1w)},${round(y1w)},${round(x2w)},${round(y2w)}`]) {
    return currPosition;
  }
  if (wallsDict[`${round(x2w)},${round(y2w)},${round(x1w)},${round(y1w)}`]) {
    return currPosition;
  }
  // Just check generally if there's a wall in the middle of tile and it's not open
  const door = doorsDict[`${round(x2)},${round(y2)}`];
  if (typeof door !== "undefined" && door === false) {
    return currPosition;
  }
  return nextPosition;
};

export const goForwards = (pos: Position, currentState: GameData): Position => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPosition(pos, setRow(pos, -1), currentState);
  }
  if (dir === 1) {
    return boundPosition(pos, setCol(pos, 1), currentState);
  }
  if (dir === 2) {
    return boundPosition(pos, setRow(pos, 1), currentState);
  }
  if (dir === 3) {
    return boundPosition(pos, setCol(pos, -1), currentState);
  }
  return pos;
};

export const goBackwards = (
  pos: Position,
  currentState: GameData
): Position => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPosition(pos, setRow(pos, 1), currentState);
  }
  if (dir === 1) {
    return boundPosition(pos, setCol(pos, -1), currentState);
  }
  if (dir === 2) {
    return boundPosition(pos, setRow(pos, -1), currentState);
  }
  if (dir === 3) {
    return boundPosition(pos, setCol(pos, 1), currentState);
  }
  return pos;
};

export const strafeRight = (
  pos: Position,
  currentState: GameData
): Position => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPosition(pos, setCol(pos, 1), currentState);
  }
  if (dir === 1) {
    return boundPosition(pos, setRow(pos, 1), currentState);
  }
  if (dir === 2) {
    return boundPosition(pos, setCol(pos, -1), currentState);
  }
  if (dir === 3) {
    return boundPosition(pos, setRow(pos, -1), currentState);
  }
  return pos;
};

export const strafeLeft = (pos: Position, currentState: GameData): Position => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPosition(pos, setCol(pos, -1), currentState);
  }
  if (dir === 1) {
    return boundPosition(pos, setRow(pos, -1), currentState);
  }
  if (dir === 2) {
    return boundPosition(pos, setCol(pos, 1), currentState);
  }
  if (dir === 3) {
    return boundPosition(pos, setRow(pos, 1), currentState);
  }
  return pos;
};

type AnyFunction = (...args: any[]) => any;
export const setPos = (fn: AnyFunction) => (state: GameData) => ({
  ...state,
  position: fn(state.position, state),
});
