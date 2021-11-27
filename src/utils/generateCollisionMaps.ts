import {
  DoorCoords,
  DoorsDict,
  SpawnPointCoords,
  SpawnPointsDict,
  WallCoords,
  WallsDict,
} from "../types";
import { wallCoords } from "../Maze/mapData";

export const generateDoorCollisions = (
  doorsCoords: DoorCoords[]
): DoorsDict => {
  const doorsDict: DoorsDict = {};
  for (let doorCoord of doorsCoords) {
    doorsDict[
      `${(doorCoord.x1 + doorCoord.x2) / 2},${
        (doorCoord.y1 + doorCoord.y2) / 2
      }`
    ] = true;
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

export const wallsDict = generateWallCollisions(wallCoords);

export const generateSpawnCollisions = (
  spawnCoords: SpawnPointCoords[]
): SpawnPointsDict => {
  const spawnDict: SpawnPointsDict = {};
  for (let spawnCoord of spawnCoords) {
    spawnDict[`${spawnCoord.x},${spawnCoord.y}`] = true;
  }
  return spawnDict;
};
