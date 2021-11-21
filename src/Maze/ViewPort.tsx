import * as React from "react";
import { doorTextureMaps } from "./DoorTextures";
import { useMonstersWithTransforms } from "../hooks/useMonstersWithTransforms";
import { wallTextureMaps } from "./WallTextures";
import { Ceiling, Floor, Outer } from "./EnvironmentTextures";
import { monsterMaps } from "./MonsterTextures";
import { DoorCoords, WallType } from "../types";
import { useUserPosition } from "../hooks/useGameData";
import { useWallsWithTransforms } from "../hooks/useWallsWithTransforms";
import { useDoorsWithTransforms } from "../hooks/useDoorsWithTransforms";
import { useGameData } from "../providers/GameData";
import clone from "lodash/clone";
import { useCallback } from "react";

export const ViewPort = () => {
  useUserPosition();
  const walls = useWallsWithTransforms();
  const doors = useDoorsWithTransforms();
  const monsters = useMonstersWithTransforms();
  const [gameData, setGameData] = useGameData();

  const wallSurfaces = walls
    .map(values => {
      const { x1, y1, x2, y2, type } = values;
      let textureMap;
      switch (type) {
        case WallType.Wall1:
          textureMap = wallTextureMaps;
          break;
        case WallType.Wall2:
          textureMap = wallTextureMaps;
          break;
      }
      const leftRight = textureMap[`${x1},${y1},${x2},${y2}`];
      const rightLeft = textureMap[`${x2},${y2},${x1},${y1}`];
      return leftRight || rightLeft;
    })
    .filter(Boolean);

  const doorSurfaces = doors
    .map(values => {
      const { x1, y1, x2, y2 } = values;
      const leftRight = doorTextureMaps[`${x1},${y1},${x2},${y2}`];
      const rightLeft = doorTextureMaps[`${x2},${y2},${x1},${y1}`];
      return { Surface: leftRight || rightLeft, ...values };
    })
    .filter(Boolean);

  const monsterComponents = monsters
    .map(({ x, y }) => {
      return monsterMaps[`${x},${y}`];
    })
    .filter(Boolean);

  const handleClick = useCallback(
    (coords: DoorCoords) => {
      const doors = gameData.doors;
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];
        if (door.id === coords.id) {
          const newDoors = clone(doors);
          newDoors[i].open = !door.open;
          setGameData({ ...gameData, doors: newDoors });
          break;
        }
      }
    },
    [doors]
  );

  return (
    <Outer>
      <Ceiling />
      <Floor />
      {wallSurfaces.map((Surface, index) => {
        return Surface ? <Surface key={index} /> : null;
      })}
      {doorSurfaces.map(({ Surface, ...rest }, index) => {
        return Surface ? (
          <Surface
            key={index}
            // @ts-ignore
            open={rest.open}
            onClick={() => handleClick(rest)}
          />
        ) : null;
      })}
      {monsterComponents.map((Monster, index) => {
        return <Monster key={index} />;
      })}
    </Outer>
  );
};
