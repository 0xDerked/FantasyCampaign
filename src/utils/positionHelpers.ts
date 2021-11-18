import { rotate } from "./rotate";
import { round } from "./round";
import { wallsDict } from "../Maze/mapData";

export enum Keys {
  Forward = "w",
  Backward = "s",
  StrafeLeft = "a",
  StrafeRight = "d",
  RotLeft = "[",
  RotRight = "]",
}

export type Pos = {
  row: number;
  col: number;
  dir: number; // up : 0, right: 1, down: 2, left: 3
};

export const setCol = (pos: Pos, delta: number) => ({
  ...pos,
  col: pos.col + delta,
});

export const setRow = (pos: Pos, delta: number) => ({
  ...pos,
  row: pos.row + delta,
});

export const rotLeft = (pos: Pos) => ({
  ...pos,
  dir: (pos.dir + 3) % 4,
});

export const rotRight = (pos: Pos) => ({
  ...pos,
  dir: (pos.dir + 1) % 4,
});

export const boundPos = (currPos: Pos, nextPos: Pos): Pos => {
  // User position is an integer so we add 0.5 to move the users into the middle of te tile
  const x1 = currPos.col + 0.5;
  const y1 = currPos.row + 0.5;
  const x2 = nextPos.col + 0.5;
  const y2 = nextPos.row + 0.5;
  // Find center point of the move vector
  const Cx = (x1 + x2) / 2;
  const Cy = (y1 + y2) / 2;
  const By = 90;
  // Rotate those points 90 degrees to get the possible vector of the wall
  const [x1p, y1p] = rotate(x1, y1, Cx, Cy, By);
  const [x2p, y2p] = rotate(x2, y2, Cx, Cy, By);
  if (wallsDict[`${round(x1p)},${round(y1p)},${round(x2p)},${round(y2p)}`]) {
    return currPos;
  }
  if (wallsDict[`${round(x2p)},${round(y2p)},${round(x1p)},${round(y1p)}`]) {
    return currPos;
  }
  return nextPos;
};

export const goForwards = (pos: Pos): Pos => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPos(pos, setRow(pos, -1));
  }
  if (dir === 1) {
    return boundPos(pos, setCol(pos, 1));
  }
  if (dir === 2) {
    return boundPos(pos, setRow(pos, 1));
  }
  if (dir === 3) {
    return boundPos(pos, setCol(pos, -1));
  }
  return pos;
};

export const goBackwards = (pos: Pos): Pos => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPos(pos, setRow(pos, 1));
  }
  if (dir === 1) {
    return boundPos(pos, setCol(pos, -1));
  }
  if (dir === 2) {
    return boundPos(pos, setRow(pos, -1));
  }
  if (dir === 3) {
    return boundPos(pos, setCol(pos, 1));
  }
  return pos;
};

export const strafeRight = (pos: Pos): Pos => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPos(pos, setCol(pos, 1));
  }
  if (dir === 1) {
    return boundPos(pos, setRow(pos, 1));
  }
  if (dir === 2) {
    return boundPos(pos, setCol(pos, -1));
  }
  if (dir === 3) {
    return boundPos(pos, setRow(pos, -1));
  }
  return pos;
};

export const strafeLeft = (pos: Pos): Pos => {
  const dir = pos.dir;
  if (dir === 0) {
    return boundPos(pos, setCol(pos, -1));
  }
  if (dir === 1) {
    return boundPos(pos, setRow(pos, -1));
  }
  if (dir === 2) {
    return boundPos(pos, setCol(pos, 1));
  }
  if (dir === 3) {
    return boundPos(pos, setRow(pos, 1));
  }
  return pos;
};
