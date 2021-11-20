import * as React from "react";
import { doorTextureMaps } from "./DoorTextures";
import { useWalls } from "../hooks/useWalls";
import { useMonsters } from "../hooks/useMonsters";
import { WallType } from "./mapData";
import { wallTextureMaps } from "./WallTextures";
import { Ceiling, Floor, Outer } from "./EnvironmentTextures";
import { monsterMaps } from "./MonsterTextures";
import { useDoors } from "../hooks/useDoors";

export const ViewPort = () => {
  const walls = useWalls();
  const monsters = useMonsters();
  const doors = useDoors();
  const [openDoors, setOpenDoors] = React.useState<string[]>([]);

  const wallSurfaces = walls
    .map(({ x1, x2, y1, y2, type }) => {
      let textureMap;
      switch (type) {
        case WallType.Wall1:
          textureMap = wallTextureMaps;
          break;
        case WallType.Wall2:
          textureMap = wallTextureMaps;
          break;
      }
      const leftRight = textureMap?.[`${x1},${y1},${x2},${y2}`];
      const rightLeft = textureMap?.[`${x2},${y2},${x1},${y1}`];
      return leftRight || rightLeft;
    })
    .filter(Boolean);

  const doorSurfaces = doors
    .map(({ x1, x2, y1, y2, type }) => {
      const leftRight = doorTextureMaps[`${x1},${y1},${x2},${y2}`];
      const rightLeft = doorTextureMaps[`${x2},${y2},${x1},${y1}`];
      return { Surface: leftRight || rightLeft, type, x1, x2, y1, y2 };
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
      {doorSurfaces.map(({ Surface, type, x1, x2, y1, y2 }, index) => {
        return Surface ? (
          <Surface
            key={index}
            onClick={() => alert(JSON.stringify({ type, x1, x2, y1, y2 }))}
          />
        ) : null;
      })}
      {monsterComponents.map((Monster, index) => {
        return <Monster key={index} />;
      })}
    </Outer>
  );
};
