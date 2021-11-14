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
			Ranger
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

	struct Ability {
		AbilityType abilityType;
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

	struct CampaignEvent {
		uint8 eventType; //0 is no information, 1 is combat, 2 is loot, 3 is puzzle
		uint256 eventId; //can map the eventId to the info about the event
		string eventName;
	} 


}