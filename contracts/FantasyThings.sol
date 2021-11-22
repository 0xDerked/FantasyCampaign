//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library FantasyThings {

	enum CharacterClass {
			Knight,
			Warlord,
			Wizard,
			Shaman,
			Cleric,
			Rogue,
			Ranger,
			Warlock
	}

	enum AbilityType {
		Strength,
		Armor,
		PhysicalBlock,
		Agility,
		Spellpower,
		Spellresistance,
		HealingPower
	}

	enum TurnType {
		NotSet,
		Combat, 
		Loot,
		Puzzle
	}

	struct Ability {
		AbilityType abilityType;
		uint8 action; //1 is attack, 2 is heal, 3 is defend
		string name;
	}

	struct CharacterAttributes {
		uint256 experience;
		uint16 health;
		uint8 strength;
		uint8 armor;
		uint8 physicalblock;
		uint8 agility;
		uint8 spellpower;
		uint8 spellresistance;
		uint8 healingpower;
		CharacterClass class;
		Ability[] abilities;
	}

	struct Mob {
		uint16 health;
		uint8 strength;
		uint8 armor;
		uint8 physicalblock;
		uint8 agility;
		uint8 spellpower;
		uint8 spellresistance;
		uint8 healingpower;
		uint8 spawnRate;
		string name;
	   Ability[] abilities;
	}

		//represent the current statistics during the campaign
	struct CampaignAttributes {
		uint16 health;
		uint8 strength;
		uint8 armor;
		uint8 physicalblock;
		uint8 agility;
		uint8 spellpower;
		uint8 spellresistance;
		uint8 healingpower;
		CharacterClass class;
		Ability[] abilities;
	}

    // Describe campaign items

  enum ItemType { Spell,Weapon,Shield}

  struct Item {
    ItemType item;
    AbilityType attr;
	 uint8 power;
	 uint8 numUses;
    string name;
  }

}
