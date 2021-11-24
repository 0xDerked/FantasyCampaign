export const mapStatsToAttributesDict = ([
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
