import { tiles, walls } from "../Maze/mapData";

export const mazeToWalls = (): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}[] => {
  const dict: Record<string, boolean> = {};
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      const tileType = tiles[y]?.[x];
      const wallConfig = walls[tileType];
      if (wallConfig?.[0] === 1) {
        dict[`${x - 0.5},${y - 0.5},${x + 0.5},${y - 0.5}`] = true;
      }
      if (wallConfig?.[1] === 1) {
        dict[`${x + 0.5},${y - 0.5},${x + 0.5},${y + 0.5}`] = true;
      }
      if (wallConfig?.[2] === 1) {
        dict[`${x - 0.5},${y + 0.5},${x + 0.5},${y + 0.5}`] = true;
      }
      if (wallConfig?.[3] === 1) {
        dict[`${x - 0.5},${y - 0.5},${x - 0.5},${y + 0.5}`] = true;
      }
    }
  }
  const coords = Object.keys(dict);
  return coords.map(coord => {
    const [x1, y1, x2, y2] = coord.split(",").map(x => parseFloat(x));
    return { x1, y1, x2, y2 };
  });
};
