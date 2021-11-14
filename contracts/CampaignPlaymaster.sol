//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./FantasyThings.sol";

abstract contract CampaignPlaymaster {

	uint256 immutable public numberOfTurns;
	mapping(uint256 => uint256) public playerTurn; //maps NFT token id to turn
	mapping(uint256 => FantasyThings.CampaignAttributes) public playerStatus;
	mapping(uint256 => bool) public turnGuaranteedEvent; //determines whether the turn is a boss or specific event guaranteed
	mapping(uint256 => FantasyThings.CampaignEvent) public guaranteedEvents; //these are the turn guaranteed events
	mapping(uint256 => FantasyThings.Mob) public mobAttributes; //mapping from an ID to mob attributes

	mapping(uint => mapping(uint=>FantasyThings.CampaignEvent)) public campaignEvents;
	mapping(uint256 => mapping(uint256 => FantasyThings.Mob[])) public combatTurnToMobs; //we want to generate this dynamically with chainlinkVRF except at specific points
	mapping(uint256 => bool) public turnInProgress; //tracks whether the player is in the middle of a turn or not

	event CampaignStarted(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignCompleted(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignAbandoned(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignFailed(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event AttackedMob(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 damageDone, string abilityName, uint256 remainingMobHealth, bool stillAlive);

	IERC721Metadata public fantasyCharacters;

	constructor(uint256 _numberOfTurns, address _fantasyCharacters) {
		numberOfTurns = _numberOfTurns;
		fantasyCharacters = IERC721Metadata(_fantasyCharacters);
	}

	modifier controlsCharacter(uint256 _tokenId) {
		require(fantasyCharacters.ownerOf(_tokenId) == msg.sender, "You do not control this character");
		_;
	}

	modifier isCombatTurn(uint256 _tokenId) {
		require(campaignEvents[_tokenId][playerTurn[_tokenId]].eventType == 1, "Cannot attack right now!");
		_;
	}

	modifier isLootTurn(uint256 _tokenId) {
		require(campaignEvents[_tokenId][playerTurn[_tokenId]].eventType == 2, "Nothing to loot!");
		_;
	}

	modifier isPuzzleTurn(uint256 _tokenId) {
		require(campaignEvents[_tokenId][playerTurn[_tokenId]].eventType == 3, "Not a puzzle!");
		_;
	}


	
	function _setMob(uint16 _health, uint8[8] memory _stats, string memory _name, FantasyThings.Ability[] memory _abilities, uint256 _mobId) internal {
		FantasyThings.Mob storage mob = mobAttributes[_mobId];
		mob.strength = _stats[0];
		///rest of stats
		mob.health = _health;
		mob.name = _name;
		for(uint i = 0; i < _abilities.length; i++) {
			mob.abilities.push(_abilities[i]);
		}
	}

	function inspectMobAbilities(uint256 _mobId) public view returns(FantasyThings.Ability[] memory) {
		return mobAttributes[_mobId].abilities;
	}

	function enterCampaign(uint256 _tokenId) external virtual;
	function generateTurn(uint256 _tokenId) external virtual;
	function attackWithStrengthAbility(uint256 _tokenId, FantasyThings.Ability memory _userAbility, uint256 _target) external virtual;
	function attackWithSpellpowerAbility(uint256 _tokenId, FantasyThings.Ability memory _userAbility, uint256 _target) external virtual;
	function attackWithAgilityAbility(uint256 _tokenId, FantasyThings.Ability memory _userAbility, uint256 _target) external virtual;
	function attackWithItem(uint256 _tokenId, uint256 _itemId, uint256 _target) external virtual;
	function _mobAttackPlayer(uint256 _tokenId, uint256 _mobIndex) internal virtual;
	

}