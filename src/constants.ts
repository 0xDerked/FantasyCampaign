import { CharacterAttributes, CharacterClass } from "./types";
import { mapStatsToAttributesDict } from "./utils/mapStatsToAttributesDict";

export const characterStats: Record<number, CharacterAttributes | null> = {
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Warlord]: mapStatsToAttributesDict([CharacterClass.Warlord, "Warlord", 100, 30, 20, 20, 20, 0, 5, 0 ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Knight]: mapStatsToAttributesDict([CharacterClass.Knight, "Knight", 100, 20, 30, 25, 15, 0, 5, 0, ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Wizard]: mapStatsToAttributesDict([CharacterClass.Wizard, "Wizard", 90, 5, 10, 5, 5, 30, 20, 0, ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Shaman]: mapStatsToAttributesDict([CharacterClass.Shaman, "Shaman", 110, 10, 15, 10, 10, 20, 15, 10, ]),
  [CharacterClass.Cleric]: null,
  [CharacterClass.Rogue]: null,
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Ranger]: mapStatsToAttributesDict([ CharacterClass.Ranger, "Ranger", 100, 10, 15, 10, 35, 0, 5, 0, ]),
  [CharacterClass.Warlock]: null,
};

export const availableCharacterIds: number[] = [
  CharacterClass.Warlord,
  CharacterClass.Shaman,
  CharacterClass.Ranger,
  CharacterClass.Wizard,
];
