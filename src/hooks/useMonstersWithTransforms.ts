import { rotate } from "../utils/rotate";
import { round } from "../utils/round";
import { useGameData } from "../providers/GameData";

export const useMonstersWithTransforms = () => {
  const [gameData] = useGameData();
  const { row, col, dir } = gameData.position;
  const Rot = 90 * dir;

  return gameData.monsters.map(({ x, y }) => {
    const Cx = col;
    const Cy = row;
    const [xp, yp] = rotate(x, y, Cx, Cy, Rot);
    const xr = round(xp);
    const yr = round(yp);
    // Monsters are in the center of the tile like players so we don't need to offset by 0.5
    return { x: xr - col, y: yr - row };
  });
};
