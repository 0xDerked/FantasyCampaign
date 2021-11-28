import { GameModes, TurnType } from "../types";

export const getGameModeFromTurnType = (
  turnType: TurnType | null
): GameModes | null => {
  if (turnType === TurnType.Loot) {
    return GameModes.Looting;
  } else if (turnType === TurnType.Combat) {
    return GameModes.InCombat;
  }
  return null;
};
