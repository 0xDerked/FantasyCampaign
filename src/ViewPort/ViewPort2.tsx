import * as React from "react";
import { Ceiling, Floor, Outer, textureMaps } from "./Walls";
import { usePositionContext } from "../providers/Position";
import { mazeToWalls } from "../utils/mazeToWalls";
import { rotate } from "../utils/rotate";

const round = (n: number) => Math.round(n * 100) / 100;

export const ViewPortWalls = () => {
  const wallCoords = mazeToWalls();
  const position = usePositionContext();
  const { row, col, dir } = position;
  const By = 90 * dir;
  const Cx = col;
  const Cy = row;
  const OFFSET = 2;
  const rotatedWallCoords = wallCoords.map(({ x1, x2, y1, y2 }) => {
    const [x1p, y1p] = rotate(x1, y1, Cx, Cy, By);
    const [x2p, y2p] = rotate(x2, y2, Cx, Cy, By);
    return {
      x1: round(x1p),
      y1: round(y1p),
      x2: round(x2p),
      y2: round(y2p),
    };
  });
  console.log(rotatedWallCoords, position);
  const surfaces = rotatedWallCoords
    .map(({ x1, y1, x2, y2 }) => {
      const one =
        textureMaps[`${x1 - col},${y1 - row},${x2 - col},${y2 - row}`];
      const two =
        textureMaps[`${x2 - col},${y2 - row},${x1 - col},${y1 - row}`];
      return one || two;
    })
    .filter(Boolean);

  return (
    <Outer>
      <Ceiling />
      <Floor />
      {surfaces.map((Surface, index) => {
        return <Surface key={index} />;
      })}
    </Outer>
  );
};
