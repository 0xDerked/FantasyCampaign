import * as React from "react";
import { Ceiling, Floor, monsterMaps, Outer, textureMaps } from "./TextureMaps";
import { usePositionContext } from "../providers/Position";
import { rotate } from "../utils/rotate";
import { monstersCoords, wallCoords } from "./mapData";
import { round } from "../utils/round";

export const ViewPort = () => {
  const position = usePositionContext();

  const { row, col, dir } = position;
  const Rot = 90 * dir;
  const wallSurfaces = wallCoords
    .map(({ x1, x2, y1, y2 }) => {
      const orow = row + 0.5;
      const ocol = col + 0.5;
      const Cx = ocol;
      const Cy = orow;
      const [x1p, y1p] = rotate(x1, y1, Cx, Cy, Rot);
      const [x2p, y2p] = rotate(x2, y2, Cx, Cy, Rot);
      const x1r = round(x1p);
      const y1r = round(y1p);
      const x2r = round(x2p);
      const y2r = round(y2p);
      const leftRight =
        textureMaps[`${x1r - ocol},${y1r - orow},${x2r - ocol},${y2r - orow}`];
      const rightLeft =
        textureMaps[`${x2r - ocol},${y2r - orow},${x1r - ocol},${y1r - orow}`];
      return leftRight || rightLeft;
    })
    .filter(Boolean);

  const monsterComponents = monstersCoords
    .map(({ x, y }) => {
      const Cx = col;
      const Cy = row;
      const [xp, yp] = rotate(x, y, Cx, Cy, Rot);
      const xr = round(xp);
      const yr = round(yp);
      return monsterMaps[`${xr - col},${yr - row}`];
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
