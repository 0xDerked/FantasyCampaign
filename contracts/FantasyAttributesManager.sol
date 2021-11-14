//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./FantasyThings.sol";

//This contract manages/stores the attributes tied to the ERC721 character tokens
contract FantasyAttributesManager {

	IERC721Metadata public s_fantasyCharacters;
	address immutable public s_fantasyCharactersAddress;

	mapping(uint256 => FantasyThings.CharacterAttributes) public s_CharacterAttributes; //tokenID to character attributes
	mapping(FantasyThings.CharacterClass => FantasyThings.CharacterAttributes) public s_StartingAttributes;

	constructor(address _fantasyCharacters) {
		s_fantasyCharacters = IERC721Metadata(_fantasyCharacters);
		s_fantasyCharactersAddress = _fantasyCharacters;

		//Create Starting Character Templates
		FantasyThings.Ability[] memory knightAbilities = new FantasyThings.Ability[](1);
		knightAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Strength,"Strike");
		_setStartingCharacter(100, [20,30,25,15,0,5,0], FantasyThings.CharacterClass.Knight, knightAbilities);

		FantasyThings.Ability[] memory warlordAbilities = new FantasyThings.Ability[](1);
		warlordAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Strength, "Strike");
		_setStartingCharacter(100, [30,20,20,20,0,5,0], FantasyThings.CharacterClass.Warlord, warlordAbilities);

		FantasyThings.Ability[] memory wizardAbilities = new FantasyThings.Ability[](1);
		wizardAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Spellpower, "Fireball");
		_setStartingCharacter(90, [5,10,5,5,30,20,0], FantasyThings.CharacterClass.Wizard, wizardAbilities);

		FantasyThings.Ability[] memory shamanAbilities = new FantasyThings.Ability[](2);
		shamanAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Spellpower,"Lightning Bolt");
		shamanAbilities[1] = FantasyThings.Ability(FantasyThings.AbilityType.HealingPower,"Nature Heal");
		_setStartingCharacter(90, [10,15,10,10,20,15,10], FantasyThings.CharacterClass.Shaman, shamanAbilities);

		FantasyThings.Ability[] memory clericAbilities = new FantasyThings.Ability[](2);
		clericAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Spellpower,"Smite");
		clericAbilities[1] = FantasyThings.Ability(FantasyThings.AbilityType.HealingPower,"Angel's Blessing");
		_setStartingCharacter(120, [5,10,5,5,10,30,30],FantasyThings.CharacterClass.Cleric, clericAbilities);

		FantasyThings.Ability[] memory rogueAbilities = new FantasyThings.Ability[](1);
		rogueAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Agility,"Stab");
		_setStartingCharacter(100, [15,15,15,30,0,5,0], FantasyThings.CharacterClass.Rogue, rogueAbilities);

		FantasyThings.Ability[] memory rangerAbilities = new FantasyThings.Ability[](1);
		rangerAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Agility,"Fire Bow");
		_setStartingCharacter(100, [10,15,10,35,0,5,0], FantasyThings.CharacterClass.Ranger, rangerAbilities);
	}

	function _setStartingCharacter(uint16 _health, uint8[7] memory _stats, FantasyThings.CharacterClass _charClass, FantasyThings.Ability[] memory _abilities) internal {
		FantasyThings.CharacterAttributes storage character = s_StartingAttributes[_charClass];
		character.health = _health;
		character.strength = _stats[0];
		character.armor = _stats[1];
		character.physicalblock = _stats[2];
		character.agility = _stats[3];
		character.spellpower = _stats[4];
		character.spellresistance = _stats[5];
		character.healingpower = _stats[6];
		character.class = _charClass;
		for(uint i = 0; i < _abilities.length; i++) {
			character.abilities.push(_abilities[i]);
		}
	}

  function registerNewCharacter(uint256 _tokenId, FantasyThings.CharacterClass _charClass) external {
	  require(msg.sender == s_fantasyCharactersAddress, "Only the NFT contract can register a character");
	  FantasyThings.CharacterAttributes storage newChar = s_CharacterAttributes[_tokenId];
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

  function getPlayer(uint256 _tokenId) external view returns(FantasyThings.CharacterAttributes memory) {
	  return s_CharacterAttributes[_tokenId];
  }

//   function getHealth(uint256 _tokenId) public view returns(uint16) {
// 	  return s_CharacterAttributes[_tokenId].health;
//   }

//   function getStrength(uint256 _tokenId) public view returns(uint8) {
// 	  return s_CharacterAttributes[_tokenId].strength;
//   }

//   function getArmor(uint256 _tokenId) public view returns(uint8) {
// 	  return s_CharacterAttributes[_tokenId].armor;
//   }

//   function getBlock(uint256 _tokenId) public view returns(uint8) {
// 	  return s_CharacterAttributes[_tokenId].physicalblock;
//   }
  
//   function getAgility(uint256 _tokenId) public view returns(uint8) {
// 	  return s_CharacterAttributes[_tokenId].agility;
//   }

//   function getSpellpower(uint256 _tokenId) public view returns(uint8) {
// 	  return s_CharacterAttributes[_tokenId].spellpower;
//   }

//   function getSpellresistance(uint256 _tokenId) public view returns(uint8) {
// 	  return s_CharacterAttributes[_tokenId].spellresistance;
//   }

//   function getHealingpower(uint256 _tokenId) public view returns(uint8) {
// 	  return s_CharacterAttributes[_tokenId].spellresistance;
//   }

//   function getCharClass(uint256 _tokenId) public view returns(FantasyThings.CharacterClass) {
// 	  return s_CharacterAttributes[_tokenId].class;
//   }

//   function getAbilities(uint256 _tokenId) public view returns(FantasyThings.Ability[] memory) {
// 	  return s_CharacterAttributes[_tokenId].abilities;
//   }

  function _gainExperience(uint256 _xpEarned, uint256 _tokenId) internal {
	  s_CharacterAttributes[_tokenId].experience += _xpEarned;
  }

  function getLevel(uint256 _tokenId) external pure returns(uint256) {
	  //some formula for calculating level based off xp
	  return 0;
  }

}
