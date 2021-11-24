import { availableCharacterIds, characterStats } from "../constants";
import { CharacterAttributes } from "../types";

export const useGetAvailableCharacters = (): CharacterAttributes[] => {
  const stats: CharacterAttributes[] = [];
  for (const id of availableCharacterIds) {
    const stat = characterStats[id];
    if (stat !== null) {
      stats.push(stat);
    }
  }
  return stats;
};
