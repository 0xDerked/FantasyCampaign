import { characterStats } from "../constants";
import { CharacterClass, CharacterStatsDictionary } from "../types";

export const useGetAvailableCharacters = (): CharacterStatsDictionary => {
  const availableCharacterIds = [
    CharacterClass.Warlord,
    CharacterClass.Shaman,
    CharacterClass.Ranger,
    CharacterClass.Wizard,
  ];
  const characterMap: CharacterStatsDictionary = {};
  if (availableCharacterIds?.length) {
    for (let i = 0; i < availableCharacterIds.length; i++) {
      const stat = characterStats[availableCharacterIds[i]];
      if (stat) {
        characterMap[i] = stat;
      }
    }
  }
  return characterMap;
};
