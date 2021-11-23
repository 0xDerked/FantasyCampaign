import { CharacterClass } from "./types";

export type CharacterAttributes = {
  id: number;
  name: string;
  health: number;
  strength: number;
  armor: number;
  block: number;
  agility: number;
  spellPower: number;
  spellResistance: number;
  healingPower: number;
};

export type CharacterStats = Record<number, CharacterAttributes | null>;

const mapStatsToDict = ([
  id,
  name,
  health,
  strength,
  armor,
  block,
  agility,
  spellPower,
  spellResistance,
  healingPower,
]: [
  number,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]) => {
  return {
    id,
    name,
    health,
    strength,
    armor,
    block,
    agility,
    spellPower,
    spellResistance,
    healingPower,
  };
};

export const characterStats: CharacterStats = {
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Warlord]: mapStatsToDict([CharacterClass.Warlord, "Warlord", 100, 30, 20, 20, 20, 0, 5, 0 ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Knight]: mapStatsToDict([CharacterClass.Knight, "Knight", 100, 20, 30, 25, 15, 0, 5, 0, ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Wizard]: mapStatsToDict([CharacterClass.Wizard, "Wizard", 90, 5, 10, 5, 5, 30, 20, 0, ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Shaman]: mapStatsToDict([CharacterClass.Shaman, "Shaman", 110, 10, 15, 10, 10, 20, 15, 10, ]),
  [CharacterClass.Cleric]: null,
  [CharacterClass.Rogue]: null,
  [CharacterClass.Ranger]: null,
  [CharacterClass.Warlock]: null,
};
