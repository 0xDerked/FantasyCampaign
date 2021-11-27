import { rotate } from "./rotate";
import { round } from "./round";
import { GameData, Position, GameModes } from "../types";
import {
  generateDoorCollisions,
  generateSpawnCollisions,
  wallsDict,
} from "./generateCollisionMaps";
import { doorsCoords, spawnPointCoords } from "../Maze/mapData";
import { X_FINAL, Y_FINAL } from "../constants";
import { getCurrentPosition } from "../hooks/usePosition";

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
  if (gameData.mode === GameModes.TurnTrigger) {
    return gameData;
  }
  return {
    ...gameData,
    direction: (gameData.direction + 3) % 4,
  };
};

export const rotRight = (gameData: GameData): GameData => {
  if (gameData.mode === GameModes.TurnTrigger) {
    return gameData;
  }
  return {
    ...gameData,
    direction: (gameData.direction + 1) % 4,
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

  // Just check generally if there's a wall in the middle of tile and it's not open
  const doorsDict = generateDoorCollisions(doorsCoords);
  const door = doorsDict[`${round(x2)},${round(y2)}`];
  if (typeof door !== "undefined" && !currentState.isGateOpen) {
    return currPosition;
  }

  // Make sure there's not a wall in the way
  if (wallsDict[`${round(x1w)},${round(y1w)},${round(x2w)},${round(y2w)}`]) {
    return currPosition;
  }
  if (wallsDict[`${round(x2w)},${round(y2w)},${round(x1w)},${round(y1w)}`]) {
    return currPosition;
  }
  return nextPosition;
};

export const goForwards = (pos: Position, currentState: GameData): Position => {
  const dir = currentState.direction;
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
  const dir = currentState.direction;
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
  const dir = currentState.direction;
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
  const dir = currentState.direction;
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

type PosFunction = (position: Position, currentState: GameData) => Position;
export const setPos = (fn: PosFunction) => (gameData: GameData) => {
  const pos = getCurrentPosition(gameData.moves);
  const newPos = fn(pos, gameData);
  const newMoves = [...gameData.moves];
  const lastPos = newMoves[newMoves.length - 1];

  // Already in turn mode so block the user exiting the spawn point
  if (gameData.mode === GameModes.TurnTrigger) {
    return gameData;
  }

  // Stop them going out of bounds
  if (newPos.col < 0 || newPos.col > 6 || newPos.row < 0 || newPos.row > 6) {
    return gameData;
  }

  // Add the new move to the list unless it's the same
  if (newPos.col !== lastPos?.col || newPos.row !== lastPos?.row) {
    newMoves.push(newPos);
  }

  // Check if the new position runs over a spawn point
  const spawnPointsDict = generateSpawnCollisions(spawnPointCoords);
  const spawnPoint =
    spawnPointsDict[`${round(newPos.col)},${round(newPos.row)}`];
  if (spawnPoint === true) {
    return {
      ...gameData,
      mode: GameModes.TurnTrigger,
      moves: newMoves,
    };
  }

  // Otherwise just return the new positions
  return {
    ...gameData,
    moves: newMoves,
  };
};
