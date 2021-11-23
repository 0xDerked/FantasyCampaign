import { CharacterAttributes, characterStats } from "../constants";

export const useGetAllCharacters = (): CharacterAttributes[] => {
  const availableCharacterIds = [0, 1, 2, 3];
  const stats = [];
  if (availableCharacterIds?.length) {
    for (let i = 0; i < availableCharacterIds.length; i++) {
      const stat = characterStats[availableCharacterIds[i]];
      if (stat) {
        stats.push(stat);
      }
    }
  }
  return stats;
};
