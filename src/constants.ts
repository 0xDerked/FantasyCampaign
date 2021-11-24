import { CharacterClass } from "./types";

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

export const characterStats = {
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
  // eslint-disable-next-line prettier/prettier
  [CharacterClass.Ranger]: mapStatsToDict([ CharacterClass.Ranger, "Ranger", 100, 10, 15, 10, 35, 0, 5, 0, ]),
  [CharacterClass.Warlock]: null,
};
