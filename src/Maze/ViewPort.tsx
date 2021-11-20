import * as React from "react";
import { doorTextureMaps } from "./DoorTextures";
import { useMonstersWithTransforms } from "../hooks/useMonstersWithTransforms";
import { wallTextureMaps } from "./WallTextures";
import { Ceiling, Floor, Outer } from "./EnvironmentTextures";
import { monsterMaps } from "./MonsterTextures";
import { WallType } from "../types";
import { useUserPosition } from "../hooks/useGameData";
import { useWallsWithTransforms } from "../hooks/useWallsWithTransforms";
import { useDoorsWithTransforms } from "../hooks/useDoorsWithTransforms";

export const ViewPort = () => {
  useUserPosition();
  const walls = useWallsWithTransforms();
  const doors = useDoorsWithTransforms();
  const monsters = useMonstersWithTransforms();

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
      const { x1, y1, x2, y2, open } = values;
      console.log(`${x1},${y1},${x2},${y2}`, open);
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

  return (
    <Outer>
      <Ceiling />
      <Floor />
      {wallSurfaces.map((Surface, index) => {
        return Surface ? <Surface key={index} /> : null;
      })}
      {doorSurfaces.map(({ Surface, open }, index) => {
        // @ts-ignore
        return Surface ? <Surface key={index} open={open} /> : null;
      })}
      {monsterComponents.map((Monster, index) => {
        return <Monster key={index} />;
      })}
    </Outer>
  );
};
