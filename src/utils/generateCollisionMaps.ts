import { DoorCoords, DoorsDict, WallCoords, WallsDict } from "../types";

export const generateDoorCollisions = (
  doorsCoords: DoorCoords[]
): DoorsDict => {
  const doorsDict: DoorsDict = {};
  for (let doorCoord of doorsCoords) {
    doorsDict[
      `${(doorCoord.x1 + doorCoord.x2) / 2},${
        (doorCoord.y1 + doorCoord.y2) / 2
      }`
    ] = doorCoord.open;
  }
  return doorsDict;
};

export const generateWallCollisions = (
  wallsCoords: WallCoords[]
): WallsDict => {
  const wallsDict: WallsDict = {};
  for (let wallCoord of wallsCoords) {
    wallsDict[
      `${wallCoord.x1},${wallCoord.y1},${wallCoord.x2},${wallCoord.y2}`
    ] = true;
  }
  return wallsDict;
};
