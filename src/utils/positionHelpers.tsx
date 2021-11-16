import { tiles, walls } from "../Maze/mapData";

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

export const getCellType = (pos: Pos): number => {
  const { row, col } = pos;
  return tiles?.[row]?.[col];
};

export const boundPos = (currPos: Pos, nextPos: Pos): Pos => {
  const currWalls = walls[getCellType(currPos)];
  const nextWalls = walls[getCellType(nextPos)];
  const rowDelta = nextPos.row - currPos.row;
  const colDelta = nextPos.col - currPos.col;
  const isValid = () => {
    if (rowDelta === -1) {
      return currWalls?.[0] === 0 && nextWalls?.[2] === 0;
    }
    if (rowDelta === 1) {
      return currWalls?.[2] === 0 && nextWalls?.[0] === 0;
    }
    if (colDelta === 1) {
      return currWalls?.[1] === 0 && nextWalls?.[3] === 0;
    }
    if (colDelta === -1) {
      return currWalls?.[3] === 0 && nextWalls?.[1] === 0;
    }
    throw "Nope";
  };
  return isValid() ? nextPos : currPos;
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
