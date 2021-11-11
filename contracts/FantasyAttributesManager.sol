//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

//This contract manages/stores the attributes tied to the ERC721 character tokens
contract FantasyAttributesManager {

	IERC721 public s_fantasyCharacters;
	address immutable public s_fantasyCharactersAddress;

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

	struct CharacterAbility {
		AbilityType abilityType;
		string name;
	}

	//try to think about packing here
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
		CharacterAbility[] abilities;
	}


	mapping(uint256 => CharacterAttributes) public s_CharacterAttributes; //tokenID to character attributes
	mapping(uint256 => CharacterAttributes) public s_StartingAttributes;

	constructor(address _fantasyCharacters) {
		s_fantasyCharacters = IERC721(_fantasyCharacters);
		s_fantasyCharactersAddress = _fantasyCharacters;

		//Create Starting Character Templates
		//experience,health,strength,armor,physicalblock,agility,spellpower,spellresistance,healingpower,class
		CharacterAttributes storage Knight = s_StartingAttributes[0];
		Knight.health = 100;
		Knight.strength = 20;
		Knight.armor = 30;
		Knight.physicalblock = 25;
		Knight.agility = 15;
		//spellpower, already 0 for knight
		Knight.spellresistance = 5;
		//healing already 0 for knight
		Knight.class = CharacterClass.Knight;
		Knight.abilities.push(CharacterAbility(AbilityType.Strength,"Strike"));

		CharacterAttributes storage Warlord = s_StartingAttributes[1];
		Warlord.health = 100;
		Warlord.strength = 30;
		Warlord.armor = 20;
		Warlord.physicalblock = 20;
		Warlord.agility = 20;
		//spellpower already 0 for warlord
		Warlord.spellresistance = 5;
		//healing already 0 for warlord
		Warlord.class = CharacterClass.Warlord;
		Warlord.abilities.push(CharacterAbility(AbilityType.Strength,"Strike"));

		CharacterAttributes storage Wizard = s_StartingAttributes[2];
		Wizard.health = 90;
		Wizard.strength = 5;
		Wizard.armor = 10;
		Wizard.physicalblock = 5;
		Wizard.agility = 5;
		Wizard.spellpower = 30;
		Wizard.spellresistance = 20;
		//healing already 0 for Wizard
		Wizard.class = CharacterClass.Wizard;
		Wizard.abilities.push(CharacterAbility(AbilityType.Spellpower,"Fireball"));

		CharacterAttributes storage Shaman = s_StartingAttributes[3];
		Shaman.health = 90;
		Shaman.strength = 10;
		Shaman.armor = 15;
		Shaman.physicalblock = 10;
		Shaman.agility = 10;
		Shaman.spellpower = 20;
		Shaman.spellresistance = 15;
		Shaman.healingpower = 10;
		Shaman.class = CharacterClass.Shaman;
		Shaman.abilities.push(CharacterAbility(AbilityType.Spellpower,"Lightning Bolt"));
		Shaman.abilities.push(CharacterAbility(AbilityType.HealingPower,"Nature Heal"));

		
		CharacterAttributes storage Cleric = s_StartingAttributes[4];
		Cleric.health = 120;
		Cleric.strength = 5;
		Cleric.armor = 10;
		Cleric.physicalblock = 5;
		Cleric.agility = 5;
		Cleric.spellpower = 10;
		Cleric.spellresistance = 30;
		Cleric.healingpower = 30;
		Cleric.class = CharacterClass.Cleric;
		Cleric.abilities.push(CharacterAbility(AbilityType.Spellpower,"Smite"));
		Cleric.abilities.push(CharacterAbility(AbilityType.HealingPower,"Angel's Blessing"));

		CharacterAttributes storage Rogue = s_StartingAttributes[5];
		Rogue.health = 100;
		Rogue.strength = 15;
		Rogue.armor = 15;
		Rogue.physicalblock = 15;
		Rogue.agility = 30;
		//spellpower 0 for rogue
		Rogue.spellresistance = 5;
		//healing power 0 for rogue 
		Rogue.class = CharacterClass.Rogue;
		Rogue.abilities.push(CharacterAbility(AbilityType.Agility,"Stab"));

		
		CharacterAttributes storage Ranger = s_StartingAttributes[6];
		Ranger.health = 100;
		Ranger.strength = 10;
		Ranger.armor = 15;
		Ranger.physicalblock = 10;
		Ranger.agility = 35;
		//spellpower 0 for Ranger
		Ranger.spellresistance = 5;
		//healing power 0 for Ranger 
		Ranger.class = CharacterClass.Ranger;
		Ranger.abilities.push(CharacterAbility(AbilityType.Agility,"Fire Bow"));
	}

  function registerNewCharacter(uint256 _tokenId, uint256 _charClass) external {
	  require(msg.sender == s_fantasyCharactersAddress, "Only the NFT contract can register a character");
	  CharacterAttributes storage newChar = s_CharacterAttributes[_tokenId];
	  newChar.abilities = s_StartingAttributes[_charClass].abilities;
	  newChar.health = s_StartingAttributes[_charClass].health;
	  newChar.strength = s_StartingAttributes[_charClass].strength;
	  newChar.armor = s_StartingAttributes[_charClass].armor;
	  newChar.physicalblock = s_StartingAttributes[_charClass].physicalblock;
	  newChar.agility = s_StartingAttributes[_charClass].agility;
	  newChar.spellpower = s_StartingAttributes[_charClass].spellpower;
	  newChar.spellresistance = s_StartingAttributes[_charClass].spellresistance;
	  newChar.healingpower = s_StartingAttributes[_charClass].healingpower;
	  newChar.class = s_StartingAttributes[_charClass].class;
  }

  function getAbilities(uint256 _tokenId) public view returns(CharacterAbility[] memory) {
	  return s_CharacterAttributes[_tokenId].abilities;
  }

  function _gainExperience(uint256 _xpEarned, uint256 _tokenId) internal {
	  s_CharacterAttributes[_tokenId].experience += _xpEarned;
  }

  function getLevel(uint256 _tokenId) external pure returns(uint256) {
	  //some formula for calculating level based off xp
	  return 0;
  }

}
