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

	FantasyAttributesManager attributesManager;
	IMockVRF mockVRF;

	FantasyThings.CampaignEvent currentEvent; //tracks the current event of the campaign

	constructor(address _fantasyCharacters, address _mockVRF, address _attributesManager) VRFConsumerBase(
		0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, //vrfCoordinator
      0x326C977E6efc84E512bB9C30f76E30c160eD06FB //LINK token
	) CampaignPlaymaster(10, _fantasyCharacters) {
		keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4; //oracle keyhash;
      fee = 0.0001 * 10**18; //0.0001 LINK //link token fee; 

		mockVRF = IMockVRF(_mockVRF);
		attributesManager = FantasyAttributesManager(_attributesManager);

		//create stats a
		FantasyThings.Ability[] memory henchmanAbilities = new FantasyThings.Ability[](1);
		henchmanAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Strength, "Attack");
		_setMob(100, [5,10,5,5,0,0,0,20], "Henchman", henchmanAbilities, 0);

		FantasyThings.Ability[] memory bigBossDragonAbilities = new FantasyThings.Ability[](2);
		bigBossDragonAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Spellpower, "Breathe Fire");
		bigBossDragonAbilities[1] = FantasyThings.Ability(FantasyThings.AbilityType.Strength, "Tail Whip");
	}

	function enterCampaign(uint256 _tokenId) external override controlsCharacter(_tokenId) {

		require(playerTurn[_tokenId] == 0, "You are already in this campaign!");
		FantasyThings.CharacterAttributes memory playerCopy = attributesManager.getPlayer(_tokenId);
		FantasyThings.CampaignAttributes storage campaignPlayer = playerStatus[_tokenId];
		
		//update the campaign attributes and character power

		campaignPlayer.health = playerCopy.health;

		campaignPlayer.strength = playerCopy.strength;
		characterPower[_tokenId][FantasyThings.AbilityType.Strength] = playerCopy.strength;

		campaignPlayer.armor = playerCopy.armor;
		characterPower[_tokenId][FantasyThings.AbilityType.Armor] = playerCopy.armor;

		campaignPlayer.physicalblock = playerCopy.physicalblock;
		characterPower[_tokenId][FantasyThings.AbilityType.PhysicalBlock] = playerCopy.physicalblock;

		campaignPlayer.agility = playerCopy.agility;
		characterPower[_tokenId][FantasyThings.AbilityType.Agility] = playerCopy.agility;

		campaignPlayer.spellpower = playerCopy.spellpower;
		campaignPlayer.spellresistance = playerCopy.spellresistance;
		campaignPlayer.healingpower = playerCopy.healingpower;
		campaignPlayer.class = playerCopy.class;
		for(uint256 i = 0; i < playerCopy.abilities.length; i++){
			campaignPlayer.abilities.push(playerCopy.abilities[i]);
		}

		playerTurn[_tokenId]++;
		emit CampaignStarted(msg.sender, address(this), _tokenId);
	}

	function _endCampaign(address _user,uint256 _tokenId) internal override {

		playerTurn[_tokenId] = 0;
		turnInProgress[_tokenId] = false;
		emit CampaignFailed(_user, address(this), _tokenId);
		//it really doesn't matter if "old" data persists in the mapping because it will be overwritten by turn generation down the line
	}

	function generateTurn(uint256 _tokenId) external override controlsCharacter(_tokenId) {
		require(playerTurn[_tokenId] > 0, "You must enter the campaign first!");
		require(!turnInProgress[_tokenId], "You must complete the current turn before progressing");

		if(turnGuaranteedEvent[playerTurn[_tokenId]]) {
			currentEvent = guaranteedEvents[playerTurn[_tokenId]];
		} else {
			//dynamically generate turn
			//if combat, set combatTurnToMobs, turnNumMobsAlive
			uint256 rng = mockVRF.requestRandomness(5, "abc");
		}
		turnInProgress[_tokenId] = true;
	}

	function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
		//later for use with the chainlinkVRF
		//can we use some sort of mapping combined with the requestId to do multiple things?!
	}

	function attackWithAbility (
		uint256 _tokenId, FantasyThings.Ability calldata _userAbility, uint256 _target) 
		external override controlsCharacter(_tokenId) isCombatTurn(_tokenId) turnActive(_tokenId) {

		require(combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health > 0, "Can't attack a dead mob");
		uint8 damage = characterPower[_tokenId][_userAbility.abilityType];
		if(damage >= combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health) {
			combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health = 0;
			turnNumMobsAlive[_tokenId][playerTurn[_tokenId]]--;
			if(turnNumMobsAlive[_tokenId][playerTurn[_tokenId]] == 0) {
				turnInProgress[_tokenId] = false;
				playerTurn[_tokenId]++;
				//emit events
				emit AttackedMob(msg.sender, address(this), _tokenId, uint256(damage), _userAbility.name,0,false);
				emit TurnCompleted(msg.sender, address(this),_tokenId, playerTurn[_tokenId], 0, 1, "");
			}
			emit AttackedMob(msg.sender, address(this), _tokenId, uint256(damage), _userAbility.name,0,false);
		} else {
			combatTurnToMobs[_tokenId][playerTurn[_tokenId]][_target].health-=uint16(damage);
			emit AttackedMob(msg.sender, address(this), _tokenId, uint256(damage), _userAbility.name,0,false);
			//mob retaliates, update player campaign stats
			_mobAttackPlayer(_tokenId, _target);
			//check for player death
			if(playerStatus[_tokenId].health == 0) {
				_endCampaign(msg.sender, _tokenId);
			}
			//emit the mobAttacked player event
		}
	}

  function attackWithItem(uint256 _tokenId, uint256 _itemId, uint256 _target) external override controlsCharacter(_tokenId) isCombatTurn(_tokenId) {

   }
  
  function _mobAttackPlayer(uint256 _tokenId, uint256 _mobIndex) internal override {

  }

}