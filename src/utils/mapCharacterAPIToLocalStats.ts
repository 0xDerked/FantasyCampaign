import { CharacterAttributesStructOutput } from "../../typechain/FantasyAttributesManager";
import { characterStats } from "../constants";
import { CharacterAttributes } from "../types";

export const mapCharacterAPIToLocalStats = (
  character: CharacterAttributesStructOutput & { name?: string },
  tokenId?: number
): CharacterAttributes => {
  const {
    abilities,
    agility,
    armor,
    name,
    class: id,
    experience,
    healingpower,
    health,
    physicalblock,
    spellpower,
    spellresistance,
    strength,
  } = character;
  const mappedAbilities = abilities.map(({ abilityType, action, name }) => ({
    abilityType,
    action,
    name,
  }));
  return {
    id,
    name: name || characterStats[id]?.name || "Unknown",
    agility,
    armor,
    experience: experience?.toNumber(),
    healingpower,
    health,
    physicalblock,
    spellpower,
    spellresistance,
    strength,
    tokenId,
    abilities: mappedAbilities,
  };
};
