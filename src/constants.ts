import { CharacterClass } from "./types";

export type CharacterStates = Record<CharacterClass, any>;

const mapStatsToDict = ([
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

export const characterStats: CharacterStates = {
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Warlord]: mapStatsToDict(["Warlord", 100, 30, 20, 20, 20, 0, 5, 0 ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Knight]: mapStatsToDict([ "Knight", 100, 20, 30, 25, 15, 0, 5, 0, ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Wizard]: mapStatsToDict([ "Wizard", 90, 5, 10, 5, 5, 30, 20, 0, ]),
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Shaman]: mapStatsToDict([ "Shaman", 110, 10, 15, 10, 10, 20, 15, 10, ]),
  [CharacterClass.Cleric]: null,
  [CharacterClass.Rogue]: null,
  [CharacterClass.Ranger]: null,
  [CharacterClass.Warlock]: null,
};
