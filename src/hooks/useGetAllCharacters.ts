import { CharacterAttributes, characterStats } from "../constants";
import { CharacterClass } from "../types";

export const useGetAllCharacters = (): CharacterAttributes[] => {
  const availableCharacterIds = [
    CharacterClass.Warlord,
    CharacterClass.Shaman,
    CharacterClass.Ranger,
    CharacterClass.Wizard,
  ];
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
