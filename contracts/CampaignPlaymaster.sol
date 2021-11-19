//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./FantasyThings.sol";
import "./FantasyAttributesManager.sol";

abstract contract CampaignPlaymaster {

	uint256 immutable public numberOfTurns;
	//tokenId -> Turn Number
	mapping(uint256 => uint256) public playerTurn;
	//tokenId -> Nonce (# of times player has played campaign)
	mapping(uint256 => uint256) public playerNonce; 
	mapping(uint256 => uint256) internal currentRandomSeed;
	uint16 public baseHealth;


	//tokenId -> playerNonce -> playerStatus
	mapping(uint256 => mapping(uint256 => FantasyThings.CampaignAttributes)) public playerStatus;
	//tokenId -> Ability Type -> Current Power (do not need a nonce as this is overwritten at enter campaign)
	mapping(uint256 => mapping(FantasyThings.AbilityType => uint8)) public characterPower;
	
	//tokenId -> turnType (no nonce, overwritten)
	mapping(uint256 => FantasyThings.TurnType) public turnGuaranteedTypes;

	//tokenId -> Turn Number -> Turn Type
	mapping(uint256 => mapping(uint256 => FantasyThings.TurnType)) public turnTypes;
	//mobId -> Attributes (no nonce, only ran once in constructor)
	mapping(uint256 => FantasyThings.Mob) public mobAttributes;

	//tokenId -> playerNonce -> Turn Number -> Mobs
	mapping(uint256 => mapping(uint256 => mapping(uint256 => FantasyThings.Mob[]))) public combatTurnToMobs;
	mapping(uint256 => uint256[]) public combatGuaranteedMobIds;

  // tokenId -> nonce -> Turn -> Items 
  FantasyThings.Item[] CampaignItems;
	mapping(uint256 => mapping(uint256 => mapping(uint256 => FantasyThings.Item[]))) public LootTurnToItems;

	//tokenId -> Turn Number -> Mobs Alive
	mapping(uint256 => mapping(uint256 => uint256)) public turnNumMobsAlive;
	mapping(uint256 => mapping(uint256 => mapping(uint256 => bool))) public mobIndexAlive;

	//tokenId -> Turn in Progress
	mapping(uint256 => bool) public turnInProgress;

	event CampaignStarted(address indexed _user, address indexed _campaign, uint256 _tokenId);
	event CampaignEnded(address indexed _campaign, uint256 _tokenId, bool _success);

	event TurnSet(uint256 _tokenId, uint256 _turnNumber);
	event TurnStarted(address indexed _campaign, uint256 _tokenId, uint256 _turnNumber, FantasyThings.TurnType _turnType);
	event TurnCompleted(address indexed _campaign, uint256 _tokenId, uint256 _turnNumber);

	event MobAttack(uint256 _mobTurnIndex, uint256 _mobAbilityIndex);

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
			mobIndexAlive[_tokenId][_turnNum][i] = true;
		}
		turnNumMobsAlive[_tokenId][playerTurn[_tokenId]] = _mobIds.length;
	}
	 
	function _setItemsForTurn(uint256 _tokenId, uint256[] memory _itemIds, uint256 _turnNum) internal {
		for(uint256 i=0; i< _itemIds.length; i++) {
			LootTurnToItems[_tokenId][playerNonce[_tokenId]][_turnNum].push(CampaignItems[_itemIds[i]]);
		}
	}
	
	 //This is a default configuration of attack with ability, can be overwritten if want to incorporate some other mechanics
	 function attackWithAbility (
		uint256 _tokenId, uint256 _abilityIndex, uint256 _target) 
		external virtual controlsCharacter(_tokenId) isCombatTurn(_tokenId) turnActive(_tokenId) {
		
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
			_retaliate(_tokenId, currentTurn, currentNonce, _target);
		}
	}

	function castHealAbility(uint256 _tokenId, uint256 _abilityIndex) 
		external virtual controlsCharacter(_tokenId) isCombatTurn(_tokenId) turnActive(_tokenId) {
		
		FantasyThings.Ability memory userAbility = attributesManager.getPlayerAbility(_tokenId, _abilityIndex);
		require(userAbility.action == 2, "Cannot heal with this ability!");

		uint256 currentNonce = playerNonce[_tokenId];

		uint8 healingPower = characterPower[_tokenId][userAbility.abilityType];
		uint16 currentHealth = playerStatus[_tokenId][currentNonce].health;

		uint16(healingPower) + currentHealth >= baseHealth ? playerStatus[_tokenId][currentNonce].health = baseHealth : 
			playerStatus[_tokenId][currentNonce].health = baseHealth + uint16(healingPower);

		uint256 index;
		for(uint256 i=0; i < combatTurnToMobs[_tokenId][currentNonce][playerTurn[_tokenId]].length; i++) {
			if (mobIndexAlive[_tokenId][playerTurn[_tokenId]][i]) {
				index = i;
				break;
			}
		}

		_retaliate(_tokenId, playerTurn[_tokenId], currentNonce, index);
	}

	function _retaliate(uint256 _tokenId, uint256 _turn, uint256 _nonce, uint256 _target) internal {
		uint256 numMobAbils = combatTurnToMobs[_tokenId][_nonce][_turn][_target].abilities.length;
		numMobAbils > 1 ? _mobAttackPlayer(_tokenId, _target, uint256(keccak256(abi.encodePacked(currentRandomSeed[_tokenId], playerStatus[_tokenId][_turn].health))) % numMobAbils) : _mobAttackPlayer(_tokenId, _target, 0);
		if(playerStatus[_tokenId][_nonce].health == 0) {
			_endCampaign(_tokenId, false);
		}
	}

	function _killMob(uint256 _tokenId, uint256 _currentNonce, uint256 _currentTurn, uint256 _target) internal {
		combatTurnToMobs[_tokenId][_currentNonce][_currentTurn][_target].health = 0;
		turnNumMobsAlive[_tokenId][_currentTurn]--;
		mobIndexAlive[_tokenId][_currentTurn][_target] = false;
		if(turnNumMobsAlive[_tokenId][_currentTurn] == 0) {
			_endTurn(_tokenId, _currentNonce);
		}
	}

	function _endTurn(uint256 _tokenId, uint256 _currentNonce) internal {
		
		turnInProgress[_tokenId] = false;
		playerTurn[_tokenId]++;

		if(playerTurn[_tokenId] > numberOfTurns) {
			_endCampaign(_tokenId, true);
		} else {
			playerStatus[_tokenId][_currentNonce].health = baseHealth;
			emit TurnCompleted(address(this),_tokenId, playerTurn[_tokenId]-1);
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
	  uint8 dmgReduction;
	  if (mobAbility.abilityType == FantasyThings.AbilityType.Strength) {
		  //block & dodge
		  baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].strength;
		  dmgReduction = playerStatus[_tokenId][currentNonce].armor/10;
	  } else if (mobAbility.abilityType == FantasyThings.AbilityType.Agility) {
		  //block & dodge
		  	baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].agility;
			dmgReduction = playerStatus[_tokenId][currentNonce].armor/10;
	  } else {
		  //fullresist
		  	baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].spellpower;
			dmgReduction = playerStatus[_tokenId][currentNonce].spellresistance/10;
		}
		if (dmgReduction < baseDamage) {
			uint8 totalDmg = baseDamage - dmgReduction;
			totalDmg >= playerStatus[_tokenId][currentNonce].health ? playerStatus[_tokenId][currentNonce].health = 0 : playerStatus[_tokenId][currentNonce].health -= totalDmg;
		}
		emit MobAttack(_mobIndex, _mobAbilityIndex);
     }

	function _endCampaign(uint256 _tokenId, bool _campaignSuccess) internal {
		playerTurn[_tokenId] = 0;
		turnInProgress[_tokenId] = false;
		playerNonce[_tokenId]++;
		emit CampaignEnded(address(this), _tokenId, _campaignSuccess);
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
