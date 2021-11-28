import { DoorCoords, SpawnPointCoords, WallCoords, WallType } from "../types";
import circuitMap from "./circuitMap";

export const MAZE_WIDTH = 7;

export const doorsCoords: DoorCoords[] = [
  { id: 1, x1: 5, y1: 6.5, x2: 6, y2: 6.5 },
];

// N, E, S, W
export const circuitWalls = [
  [0, 1, 0, 0], // 0
  [0, 0, 1, 0], // 1
  [0, 0, 0, 1], // 2
  [1, 0, 0, 0], // 3
  [0, 1, 1, 0], // 4
  [0, 0, 1, 1], // 5
  [1, 0, 0, 1], // 6
  [1, 1, 0, 0], // 7
  [0, 1, 1, 1], // 8
  [1, 0, 1, 1], // 9
  [1, 1, 0, 1], // 10
  [1, 1, 1, 0], // 11
  [0, 1, 0, 1], // 12
  [1, 0, 1, 0], // 13
  [0, 0, 0, 0], // 14
  [1, 1, 1, 1], // 15
];

const generateWallCoords = (): WallCoords[] => {
  const dict: Record<`${number},${number},${number},${number}`, WallType> = {};
  circuitMap.forEach((row, y) =>
    row.forEach((cellType, x) => {
      const wall = circuitWalls[cellType];
      const [n, e, s, w] = wall;
      if (n === 1) {
        dict[`${x},${y},${x + 1},${y}`] = WallType.Wall2;
      }
      if (e === 1) {
        dict[`${x + 1},${y},${x + 1},${y + 1}`] = WallType.Wall2;
      }
      if (s === 1) {
        dict[`${x},${y + 1},${x + 1},${y + 1}`] = WallType.Wall2;
      }
      if (w === 1) {
        dict[`${x},${y},${x},${y + 1}`] = WallType.Wall2;
      }
    })
  );
  const entries = Object.entries(dict);
  return entries.map(([key, value]) => {
    const [x1, y1, x2, y2] = key.split(",").map(Number);
    return { x1, y1, x2, y2, type: WallType.Wall2 };
  });
};

export const wallCoords: WallCoords[] = generateWallCoords();

export const spawnPointCoords: SpawnPointCoords[] = [
  { x: 1, y: 3, type: "Henchman", isUsed: false },
  { x: 1, y: 6, type: "Loot", isUsed: false },
  { x: 3, y: 2, type: "Loot", isUsed: false },
];
