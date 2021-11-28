import { Position } from "../types";
import { useGameData } from "./useGameData";
import { useMemo } from "react";

export const getCurrentPosition = (moves: Position[]): Position => {
  return moves[moves.length - 1];
};

export const usePosition = (): Position & { dir: number } => {
  const [gameData] = useGameData();
  const { moves } = gameData;
  const direction = gameData.direction;
  const position = getCurrentPosition(moves);
  return useMemo(
    () => ({ ...position, dir: direction }),
    [position, direction]
  );
};
