export enum WallType {
  Wall1 = 0,
  Wall2 = 1,
  DoorClosed = 2,
  DoorOpen = 3,
}

export const wallCoords: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: WallType;
}[] = [
  { x1: 1, y1: 0, x2: 2, y2: 0, type: WallType.DoorClosed },
  { x1: 1, y1: 0, x2: 2, y2: 0, type: WallType.DoorOpen },
  { x1: 0, y1: 0, x2: 1, y2: 0, type: WallType.Wall2 },
  { x1: 2, y1: 0, x2: 3, y2: 0, type: WallType.Wall2 },
  { x1: 0, y1: 0, x2: 0, y2: 1, type: WallType.Wall2 },
  { x1: 1, y1: 1, x2: 2, y2: 1, type: WallType.Wall2 },
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

export const wallsDict: Record<
  `${number},${number},${number},${number}`,
  boolean
> = {};
for (let wallCoord of wallCoords) {
  wallsDict[`${wallCoord.x1},${wallCoord.y1},${wallCoord.x2},${wallCoord.y2}`] =
    true;
}

export const monstersCoords = [
  { x: 0, y: 0, type: 1 },
  { x: 2, y: 2, type: 1 },
  { x: 1, y: 4, type: 2 },
];
