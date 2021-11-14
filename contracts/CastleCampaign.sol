//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./FantasyAttributesManager.sol";
import "./FantasyThings.sol";
import "./CampaignPlaymaster.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

interface IMockVRF {
	function requestRandomness(uint256 _num, string calldata _letters) external view returns(uint256);
}

contract CastleCampaign is VRFConsumerBase, CampaignPlaymaster {

	bytes32 public keyHash;
	uint256 public fee;

	//IERC721Metadata FantasyCharacters;
	FantasyAttributesManager attributesManager;
	IMockVRF mockVRF;

	FantasyThings.CampaignEvent currentEvent; //tracks the current event of the campaign

	constructor(address _fantasyCharacters, address _mockVRF, address _attributesManager) VRFConsumerBase(
		0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, //vrfCoordinator
      0x326C977E6efc84E512bB9C30f76E30c160eD06FB //LINK token
	) CampaignPlaymaster(10, _fantasyCharacters) {
		keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4; //oracle keyhash;
      fee = 0.0001 * 10**18; //0.0001 LINK //link token fee; 

		//FantasyCharacters = IERC721Metadata(_fantasyCharacters);
		mockVRF = IMockVRF(_mockVRF);
		attributesManager = FantasyAttributesManager(_attributesManager);

		//set stats array for henchman
		FantasyThings.Ability[] memory henchmanAbilities = new FantasyThings.Ability[](1);
		henchmanAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Strength, "Attack");
		_setMob(100, [5,10,5,5,0,0,0,20], "Henchman", henchmanAbilities, 0);

		FantasyThings.Ability[] memory bigBossDragonAbilities = new FantasyThings.Ability[](2);
		bigBossDragonAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Spellpower, "Breathe Fire");
		bigBossDragonAbilities[1] = FantasyThings.Ability(FantasyThings.AbilityType.Strength, "Tail Whip");
	}

	function enterCampaign(uint256 _tokenId) external override controlsCharacter(_tokenId) {
		require(playerTurn[_tokenId] == 0, "You are already in this campaign!");
		//set campaignAttributes
		FantasyThings.CharacterAttributes memory playerCopy = attributesManager.getPlayer(_tokenId);
		FantasyThings.CampaignAttributes storage player = playerStatus[_tokenId];

		player.health = playerCopy.health;
		player.strength = playerCopy.strength;
		player.armor = playerCopy.armor;
		player.physicalblock = playerCopy.physicalblock;
		player.agility = playerCopy.agility;
		player.spellpower = playerCopy.spellpower;
		player.spellresistance = playerCopy.spellresistance;
		player.healingpower = playerCopy.healingpower;
		player.class = playerCopy.class;
		//player.abilities = playerCopy.abilities;

		playerTurn[_tokenId]++;
		emit CampaignStarted(msg.sender, address(this), _tokenId);
	}

	function generateTurn(uint256 _tokenId) external override controlsCharacter(_tokenId) {
		require(playerTurn[_tokenId] > 0, "You must enter the campaign first!");
		require(!turnInProgress[_tokenId], "You must complete the current turn before progressing");

		if(turnGuaranteedEvent[playerTurn[_tokenId]]) {
			currentEvent = guaranteedEvents[playerTurn[_tokenId]];
		} else {
			//dynamically generate turn
			uint256 rng = mockVRF.requestRandomness(5, "abc");
		}

		playerTurn[_tokenId]++;
		turnInProgress[_tokenId] = true;
	}

	function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
		//later for use with the chainlinkVRF
		//can we use some sort of mapping combined with the requestId to do multiple things?!
	}

	function attackWithStrengthAbility(
		uint256 _tokenId, FantasyThings.Ability calldata _userAbility, uint256 _target) 
		external override controlsCharacter(_tokenId) isCombatTurn(_tokenId) {
		require(combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health > 0, "Can't attack a dead mob");
		uint8 damage = playerStatus[_tokenId].strength;
		if(damage >= combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health) {
			combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health = 0;
			emit AttackedMob(msg.sender, address(this), _tokenId, uint256(damage), _userAbility.name,0,false);
		} else {
			combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health-=uint16(damage);
		}
	}

  function attackWithSpellpowerAbility(
	   uint256 _tokenId, FantasyThings.Ability calldata _userAbility, uint256 _target) 
	   external override controlsCharacter(_tokenId) isCombatTurn(_tokenId) {

	}

  function attackWithAgilityAbility(
	  uint256 _tokenId, FantasyThings.Ability calldata _userAbility, uint256 _target) 
	  external override controlsCharacter(_tokenId) isCombatTurn(_tokenId) {
		
	}

  function attackWithItem(uint256 _tokenId, uint256 _itemId, uint256 _target) external override controlsCharacter(_tokenId) isCombatTurn(_tokenId) {

   }
  
  function _mobAttackPlayer(uint256 _tokenId, uint256 _mobIndex) internal override {

  }

}