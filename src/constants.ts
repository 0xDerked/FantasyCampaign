import { CharacterAttributes, CharacterClass } from "./types";
import barbarianFront from "./assets/scaled/barbarian_select.png";
import barbarianBack from "./assets/scaled/barbarian_back.png";
import shamanFront from "./assets/scaled/shaman_front.png";
import shamanBack from "./assets/scaled/shaman_back.png";
import wizardFront from "./assets/scaled/wizard_front.png";
import wizardBack from "./assets/scaled/wizard_back.png";
import rangerFront from "./assets/scaled/ranger_front.png";
import rangerBack from "./assets/scaled/ranger_back.png";

export const X_FINAL = 5;
export const Y_FINAL = 5;

export const characterStats: Record<number, CharacterAttributes | null> = {
  [CharacterClass.Warlord]: {
    // abilities: [[0, 1, "Strike"]],
    id: CharacterClass.Warlord,
    name: "Warlord",
    experience: 0,
    health: 100,
    strength: 30,
    armor: 20,
    physicalblock: 20,
    agility: 20,
    spellpower: 0,
    spellresistance: 5,
    healingpower: 0,
    abilities: [
      {
        abilityType: 0,
        action: 1,
        name: "Strike",
      },
    ],
  },
  [CharacterClass.Knight]: null,
  [CharacterClass.Wizard]: {
    // abilities: [[0, 1, "Strike"]],
    id: CharacterClass.Wizard,
    name: "Wizard",
    experience: 0,
    health: 90,
    strength: 5,
    armor: 10,
    physicalblock: 5,
    agility: 5,
    spellpower: 30,
    spellresistance: 20,
    healingpower: 0,
    abilities: [
      {
        abilityType: 4,
        action: 1,
        name: "Fireball",
      },
    ],
  },
  [CharacterClass.Shaman]: {
    id: CharacterClass.Shaman,
    name: "Shaman",
    experience: 0,
    health: 110,
    strength: 10,
    armor: 15,
    physicalblock: 10,
    agility: 10,
    spellpower: 20,
    spellresistance: 15,
    healingpower: 10,
    abilities: [
      {
        abilityType: 4,
        action: 1,
        name: "Lightning Bolt",
      },
      {
        abilityType: 6,
        action: 2,
        name: "Nature Heal",
      },
    ],
  },
  [CharacterClass.Cleric]: null,
  [CharacterClass.Rogue]: null,
  [CharacterClass.Ranger]: {
    // abilities: [[0, 1, "Strike"]],
    id: CharacterClass.Ranger,
    name: "Ranger",
    experience: 0,
    health: 100,
    strength: 10,
    armor: 15,
    physicalblock: 10,
    agility: 35,
    spellpower: 0,
    spellresistance: 5,
    healingpower: 0,
    abilities: [
      {
        abilityType: 3,
        action: 1,
        name: "Fire Bow",
      },
    ],
  },
  [CharacterClass.Warlock]: null,
};

export const availableCharacterIds: number[] = [
  CharacterClass.Warlord,
  CharacterClass.Shaman,
  CharacterClass.Ranger,
  CharacterClass.Wizard,
];

export const CharacterAssets: Record<number, { front: any; back: any } | null> =
  {
    [CharacterClass.Warlord]: {
      front: barbarianFront,
      back: barbarianBack,
    },
    [CharacterClass.Shaman]: {
      front: shamanFront,
      back: shamanBack,
    },
    [CharacterClass.Ranger]: {
      front: rangerFront,
      back: rangerBack,
    },
    [CharacterClass.Wizard]: {
      front: wizardFront,
      back: wizardBack,
    },
    [CharacterClass.Knight]: null,
    [CharacterClass.Cleric]: null,
    [CharacterClass.Rogue]: null,
    [CharacterClass.Warlock]: null,
  };
