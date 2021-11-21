import { DoorCoords, SpawnPointCoords, WallCoords, WallType } from "../types";

export const doorsCoords: DoorCoords[] = [
  { id: 1, x1: 0, y1: 0.5, x2: 1, y2: 0.5, open: true },
  { id: 2, x1: 1, y1: 2.5, x2: 2, y2: 2.5, open: false },
  { id: 3, x1: 3, y1: 1.5, x2: 4, y2: 1.5, open: false },
];

export const wallCoords: WallCoords[] = [
  { x1: 1, y1: 0, x2: 2, y2: 0, type: WallType.Wall2 },
  { x1: 2, y1: 0, x2: 3, y2: 0, type: WallType.Wall2 },
  { x1: 0, y1: 0, x2: 0, y2: 1, type: WallType.Wall2 },
  { x1: 1, y1: 0, x2: 1, y2: 1, type: WallType.Wall2 },
  { x1: 2, y1: 0, x2: 3, y2: 0, type: WallType.Wall2 },
  { x1: 3, y1: 0, x2: 3, y2: 1, type: WallType.Wall2 },
  { x1: 2, y1: 1, x2: 3, y2: 1, type: WallType.Wall2 },
  { x1: 3, y1: 0, x2: 4, y2: 0, type: WallType.Wall2 },
  { x1: 4, y1: 0, x2: 5, y2: 0, type: WallType.Wall2 },
  { x1: 5, y1: 0, x2: 5, y2: 1, type: WallType.Wall2 },
  { x1: 4, y1: 1, x2: 5, y2: 1, type: WallType.Wall2 },
  { x1: 0, y1: 2, x2: 1, y2: 2, type: WallType.Wall2 },
  { x1: 0, y1: 1, x2: 0, y2: 2, type: WallType.Wall2 },
  { x1: 3, y1: 1, x2: 3, y2: 2, type: WallType.Wall2 },
  { x1: 4, y1: 1, x2: 4, y2: 2, type: WallType.Wall2 },
  { x1: 5, y1: 1, x2: 5, y2: 2, type: WallType.Wall2 },
  { x1: 1, y1: 2, x2: 1, y2: 3, type: WallType.Wall2 },
  { x1: 0, y1: 2, x2: 0, y2: 3, type: WallType.Wall2 },
  { x1: 2, y1: 2, x2: 2, y2: 3, type: WallType.Wall2 },
  { x1: 2, y1: 3, x2: 3, y2: 3, type: WallType.Wall2 },
  { x1: 4, y1: 2, x2: 4, y2: 3, type: WallType.Wall2 },
  { x1: 3, y1: 3, x2: 4, y2: 3, type: WallType.Wall2 },
  { x1: 5, y1: 2, x2: 5, y2: 3, type: WallType.Wall2 },
  { x1: 0, y1: 4, x2: 1, y2: 4, type: WallType.Wall2 },
  { x1: 0, y1: 3, x2: 0, y2: 4, type: WallType.Wall2 },
  { x1: 1, y1: 4, x2: 2, y2: 4, type: WallType.Wall2 },
  { x1: 5, y1: 3, x2: 5, y2: 4, type: WallType.Wall2 },
  { x1: 4, y1: 4, x2: 5, y2: 4, type: WallType.Wall2 },
  { x1: 0, y1: 5, x2: 1, y2: 5, type: WallType.Wall2 },
  { x1: 0, y1: 4, x2: 0, y2: 5, type: WallType.Wall2 },
  { x1: 1, y1: 5, x2: 2, y2: 5, type: WallType.Wall2 },
  { x1: 3, y1: 4, x2: 3, y2: 5, type: WallType.Wall2 },
  { x1: 2, y1: 5, x2: 3, y2: 5, type: WallType.Wall2 },
  { x1: 3, y1: 5, x2: 4, y2: 5, type: WallType.Wall2 },
  { x1: 5, y1: 4, x2: 5, y2: 5, type: WallType.Wall2 },
  { x1: 4, y1: 5, x2: 5, y2: 5, type: WallType.Wall2 },
];

export const spawnPointCoords: SpawnPointCoords[] = [
  { x: 0, y: 0 },
  { x: 2, y: 2 },
  { x: 1, y: 4 },
];
