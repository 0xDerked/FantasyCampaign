import * as React from "react";
import { Ceiling, Floor, monsterMaps, Outer, textureMaps } from "./TextureMaps";
import { useWalls } from "../hooks/useWalls";
import { useMonsters } from "../hooks/useMonsters";

export const ViewPort = () => {
  const walls = useWalls();
  const monsters = useMonsters();

  const wallSurfaces = walls
    .map(({ x1, x2, y1, y2 }) => {
      const leftRight = textureMaps[`${x1},${y1},${x2},${y2}`];
      const rightLeft = textureMaps[`${x2},${y2},${x1},${y1}`];
      return leftRight || rightLeft;
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
        return <Surface key={index} />;
      })}
      {monsterComponents.map((Monster, index) => {
        return <Monster key={index} />;
      })}
    </Outer>
  );
};
