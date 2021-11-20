import { usePositionContext } from "../providers/Position";
import { monstersCoords } from "../Maze/mapData";
import { rotate } from "../utils/rotate";
import { round } from "../utils/round";

export const useMonsters = () => {
  const position = usePositionContext();
  const { row, col, dir } = position;
  const Rot = 90 * dir;

  return monstersCoords.map(({ x, y }) => {
    const Cx = col;
    const Cy = row;
    const [xp, yp] = rotate(x, y, Cx, Cy, Rot);
    const xr = round(xp);
    const yr = round(yp);
    // Monsters are in the center of the tile like players so we don't need to offset by 0.5
    return { x: xr - col, y: yr - row };
  });
};
