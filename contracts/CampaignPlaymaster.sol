//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./FantasyThings.sol";
import "./FantasyAttributesManager.sol";

abstract contract CampaignPlaymaster {

	uint256 immutable public numberOfTurns;
	mapping(uint256 => uint256) public playerTurn; //maps NFT token id to turn
	mapping(uint256 => uint256) public playerNonce; 
	uint16 public baseHealth;


	//tokenId -> playerNonce -> playerStatus
	mapping(uint256 => mapping(uint256 => FantasyThings.CampaignAttributes)) public playerStatus;
	mapping(uint256 => mapping(FantasyThings.AbilityType => uint8)) public characterPower; //this mapping is useful for dynamically selecting power for attacks and defends
	
	mapping(uint256 => FantasyThings.TurnType) public turnGuaranteedTypes;

	//tokenId -> Turn Number -> Turn Type
	mapping(uint256 => mapping(uint256 => FantasyThings.TurnType)) public turnTypes;
	mapping(uint256 => FantasyThings.Mob) public mobAttributes; //mapping from an ID to mob attributes

	//tokenId -> playerNonce -> Turn Number -> Mobs
	mapping(uint256 => mapping(uint256 => mapping(uint256 => FantasyThings.Mob[]))) public combatTurnToMobs; //we want to generate this dynamically with chainlinkVRF except at specific points
	mapping(uint256 => uint256[]) public combatGuaranteedMobIds;

	mapping(uint256 => mapping(uint256 => uint256)) public turnNumMobsAlive; //player -> turn -> number of remaining mobs
	mapping(uint256 => bool) public turnInProgress; //tracks whether the player is in the middle of a turn or not

	event CampaignStarted(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignCompleted(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignAbandoned(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignFailed(address indexed _user, address indexed _campaign, uint256 _tokenId);

	event TurnStarted(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 _turnNumber, FantasyThings.TurnType _turnType);
	event TurnCompleted(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 _turnNumber);
	event PlayerDied(address indexed _user, address indexed _campaign, uint256 _tokenId, uint256 _turnNumber);

	IERC721Metadata public fantasyCharacters;
	FantasyAttributesManager attributesManager;


	constructor(uint256 _numberOfTurns, address _fantasyCharacters, address _attributesManager) {
		numberOfTurns = _numberOfTurns;
		fantasyCharacters = IERC721Metadata(_fantasyCharacters);
		attributesManager = FantasyAttributesManager(_attributesManager);
	}

	modifier controlsCharacter(uint256 _tokenId) {
		require(fantasyCharacters.ownerOf(_tokenId) == msg.sender, "You do not control this character");
		_;
	}

	modifier turnActive(uint256 _tokenId) {
		require(turnInProgress[_tokenId], "No turn in progress, generate a turn");
		_;
	}

	modifier isCombatTurn(uint256 _tokenId) {
		require(turnTypes[_tokenId][playerTurn[_tokenId]] == FantasyThings.TurnType.Combat, "Cannot attack right now!");
		_;
	}

	modifier isCombatAbility(FantasyThings.Ability calldata _ability) {
		require(_ability.action == 1, "Not an attack ability");
		_;
	}

	modifier isLootTurn(uint256 _tokenId) {
		require(turnTypes[_tokenId][playerTurn[_tokenId]] == FantasyThings.TurnType.Loot, "Nothing to loot!");
		_;
	}

	modifier isPuzzleTurn(uint256 _tokenId) {
		require(turnTypes[_tokenId][playerTurn[_tokenId]] == FantasyThings.TurnType.Puzzle, "Not a puzzle!");
		_;
	}

	function getCurrentCampaignStats(uint256 _tokenId) external view returns(FantasyThings.CampaignAttributes memory) {
		return playerStatus[_tokenId][playerNonce[_tokenId]];
	}
	
	function _setMob(uint16 _health, uint8[8] memory _stats, string memory _name, FantasyThings.Ability[] memory _abilities, uint256 _mobId) internal {
		FantasyThings.Mob storage mob = mobAttributes[_mobId];
		mob.strength = _stats[0];
		mob.armor = _stats[1];
		mob.physicalblock = _stats[2];
		mob.agility = _stats[3];
		mob.spellpower = _stats[4];
		mob.spellresistance = _stats[5];
		mob.healingpower = _stats[6];
		mob.spawnRate = _stats[7];
		mob.health = _health;
		mob.name = _name;
		for(uint i = 0; i < _abilities.length; i++) {
			mob.abilities.push(_abilities[i]);
		}
	}

	function _setMobsForTurn(uint256 _tokenId, uint256[] memory _mobIds, uint256 _turnNum) internal {
		for(uint256 i=0; i< _mobIds.length; i++) {
			combatTurnToMobs[_tokenId][playerNonce[_tokenId]][_turnNum].push(mobAttributes[_mobIds[i]]);
		}
	}

	 function attackWithAbility (
		uint256 _tokenId, uint256 _abilityIndex, uint256 _target) 
		external controlsCharacter(_tokenId) isCombatTurn(_tokenId) turnActive(_tokenId) {
		
		uint256 currentNonce = playerNonce[_tokenId];
		uint256 currentTurn = playerTurn[_tokenId];

		require(combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].health > 0, "Can't attack a dead mob");
		FantasyThings.Ability memory userAbility = attributesManager.getPlayerAbility(_tokenId, _abilityIndex);
		require(userAbility.action == 1, "Cannot attack with this ability!");

		uint8 damageBase = characterPower[_tokenId][userAbility.abilityType];
		uint16 targetHealthStart = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].health;
		uint8 damageTotal = damageBase - _getDamageReductionMob(_tokenId, userAbility.abilityType, _target);

		if(damageTotal >= targetHealthStart) {
			_killMob(_tokenId, currentNonce, currentTurn, _target);
		} else {
			combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].health-=uint16(damageTotal);
			_mobAttackPlayer(_tokenId, _target, 0);
			if(playerStatus[_tokenId][currentNonce].health == 0) {
				playerTurn[_tokenId] = 0;
				turnInProgress[_tokenId] = false;
				playerNonce[_tokenId]++;
			}
		}
	}

	function _killMob(uint256 _tokenId, uint256 _currentNonce, uint256 _currentTurn, uint256 _target) internal {
		combatTurnToMobs[_tokenId][_currentNonce][_currentTurn][_target].health = 0;
		turnNumMobsAlive[_tokenId][_currentTurn]--;
		if(turnNumMobsAlive[_tokenId][_currentTurn] == 0) {
			_endTurn(_tokenId, _currentNonce);
			}
	}

	function _endTurn(uint256 _tokenId, uint256 _currentNonce) internal {
		turnInProgress[_tokenId] = false;
		playerTurn[_tokenId]++;
		if(playerTurn[_tokenId] > numberOfTurns) {
			playerTurn[_tokenId] = 0;
			emit CampaignCompleted(msg.sender, address(this), _tokenId);
		} else {
			//reset to base health
			playerStatus[_tokenId][_currentNonce].health = baseHealth;
			emit TurnCompleted(msg.sender, address(this),_tokenId, playerTurn[_tokenId]);
		}
	}
	
	function _getDamageReductionMob(uint256 _tokenId, FantasyThings.AbilityType _attackType, uint256 _target) internal view returns(uint8) {

		uint256 currentNonce = playerNonce[_tokenId];
		uint256 currentTurn = playerTurn[_tokenId];

		if(_attackType == FantasyThings.AbilityType.Strength || _attackType == FantasyThings.AbilityType.Agility){
			//check for dodge or block
			return combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].armor/10; //1 point per 10 armor to start
		} else {
			//check for full spell resist
			return combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].spellresistance/10; //1 point per 10 sr to start
		}
	}

	function _mobAttackPlayer(uint256 _tokenId, uint256 _mobIndex, uint256 _mobAbilityIndex) internal {
	  uint256 currentNonce = playerNonce[_tokenId];
	  uint256 currentTurn = playerTurn[_tokenId];
	  FantasyThings.Ability memory mobAbility = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].abilities[_mobAbilityIndex];
	  uint8 baseDamage;
	  if (mobAbility.abilityType == FantasyThings.AbilityType.Strength) {
		  baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].strength;
		  uint8 dmgReduction = playerStatus[_tokenId][currentNonce].armor/10;
		  playerStatus[_tokenId][currentNonce].health-=(baseDamage-dmgReduction);
	  } else if (mobAbility.abilityType == FantasyThings.AbilityType.Agility) {
		  	baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].agility;
			uint8 dmgReduction = playerStatus[_tokenId][currentNonce].armor/10;
			playerStatus[_tokenId][currentNonce].health-=(baseDamage-dmgReduction);
	  } else {
		  	baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].spellpower;
			uint8 dmgReduction = playerStatus[_tokenId][currentNonce].spellresistance/10;
			playerStatus[_tokenId][currentNonce].health-=(baseDamage-dmgReduction);
		}
     }

	function _endCampaign(uint256 _tokenId) internal {
		playerTurn[_tokenId] = 0;
		turnInProgress[_tokenId] = false;
		playerNonce[_tokenId]++;
	}
	function inspectMob(uint256 _mobId) public view returns(FantasyThings.Mob memory) {
		return mobAttributes[_mobId];
	}

	function getMobsForTurn(uint256 _tokenId, uint256 _turnNum) public view returns(FantasyThings.Mob[] memory) {
		return combatTurnToMobs[_tokenId][playerNonce[_tokenId]][_turnNum];
	}

	function inspectMobAbilities(uint256 _mobId) public view returns(FantasyThings.Ability[] memory) {
		return mobAttributes[_mobId].abilities;
	}

	function getMobAbility(uint256 _mobId, uint256 _abilityId) public view returns(FantasyThings.Ability memory) {
		return mobAttributes[_mobId].abilities[_abilityId];
	}

	function enterCampaign(uint256 _tokenId) external virtual;
	function generateTurn(uint256 _tokenId) external virtual;
	function attackWithItem(uint256 _tokenId, uint256 _itemId, uint256 _target) external virtual;	

}