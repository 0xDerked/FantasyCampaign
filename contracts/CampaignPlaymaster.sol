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
	mapping(uint256 => uint16) public baseHealth;
	//tokenId -> bool
	mapping(uint256 => bool) public bossFightAvailable;

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

	//tokenId -> nonce -> Items
	mapping(uint256 => mapping(uint256 => FantasyThings.Item[])) public campaignInventory;

    FantasyThings.Item[] public CampaignItems;
	mapping(uint256 => uint256[]) public lootGuaranteedItemIds;

	//tokenId -> Turn Number -> Mobs Alive
	mapping(uint256 => mapping(uint256 => uint256)) public turnNumMobsAlive;
	mapping(uint256 => mapping(uint256 => mapping(uint256 => bool))) public mobIndexAlive;

	//tokenId -> Turn in Progress
	mapping(uint256 => bool) public turnInProgress;

	event CampaignStarted(uint256 indexed _tokenId);
	event CampaignEnded(uint256 indexed _tokenId, bool _success);

	event TurnSet(uint256 indexed _tokenId);
	event TurnStarted(uint256 indexed _tokenId);
	event TurnCompleted(uint256 indexed _tokenId);

	event CombatSequence(uint256 indexed _tokenId, uint8 indexed _damageDone);

	IERC721Metadata public fantasyCharacters;
	FantasyAttributesManager public attributesManager;

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

	function _setItemsForTurn(uint256 _tokenId, uint256[] memory _itemIds) internal {
		for(uint256 i=0; i< _itemIds.length; i++) {
			campaignInventory[_tokenId][playerNonce[_tokenId]].push(CampaignItems[_itemIds[i]]);
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
		uint8 damageTotal = _getDamageTotal(_tokenId, userAbility.abilityType, _target, damageBase);

		if(damageTotal >= targetHealthStart) {
			_killMob(_tokenId, currentNonce, currentTurn, _target);
		} else {
			combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].health-=uint16(damageTotal);
			_retaliate(_tokenId, currentTurn, currentNonce, _target);
		}

		emit CombatSequence(_tokenId, damageTotal);

	}

	function attackWithItem(
		uint256 _tokenId, uint256 _itemId, uint256 _target)
		external virtual controlsCharacter(_tokenId) isCombatTurn(_tokenId) turnActive(_tokenId) {

	  uint256 currentNonce = playerNonce[_tokenId];
	  uint256 currentTurn = playerTurn[_tokenId];
	  FantasyThings.Item memory attackItem = campaignInventory[_tokenId][currentNonce][_itemId];
	  require(attackItem.item == FantasyThings.ItemType.Weapon, "Can't attack with this Item");
	  require(attackItem.numUses > 0, "This item is expired");
	  require(combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].health > 0, "Can't attack a dead mob");

	  uint8 damageBase = attackItem.power;
	  uint16 targetHealthStart = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].health;
	  uint8 damageTotal = _getDamageTotal(_tokenId, attackItem.attr, _target, damageBase);

	  campaignInventory[_tokenId][playerNonce[_tokenId]][_itemId].numUses--;

	  if(damageTotal >= targetHealthStart) {
			_killMob(_tokenId, currentNonce, currentTurn, _target);
		} else {
			combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].health-=uint16(damageTotal);
			_retaliate(_tokenId, currentTurn, currentNonce, _target);
		}

		emit CombatSequence(_tokenId, damageTotal);
   }

	function applyItemSpell(uint256 _tokenId, uint256 _itemId) external virtual
	controlsCharacter(_tokenId) {
		uint256 currentNonce = playerNonce[_tokenId];
	  	FantasyThings.Item memory applyItem = campaignInventory[_tokenId][currentNonce][_itemId];
		require(applyItem.item == FantasyThings.ItemType.Spell, "Can't apply spells with this Item");
	  	require(applyItem.numUses > 0, "This item is expired");
		campaignInventory[_tokenId][playerNonce[_tokenId]][_itemId].numUses--;

		characterPower[_tokenId][applyItem.attr] + applyItem.power > 255 ? characterPower[_tokenId][applyItem.attr] = 255 : characterPower[_tokenId][applyItem.attr]+=applyItem.power;
	}

	function castHealAbility(uint256 _tokenId, uint256 _abilityIndex)
		external virtual controlsCharacter(_tokenId) isCombatTurn(_tokenId) turnActive(_tokenId) {

		FantasyThings.Ability memory userAbility = attributesManager.getPlayerAbility(_tokenId, _abilityIndex);
		require(userAbility.action == 2, "Cannot heal with this ability!");

		uint256 currentNonce = playerNonce[_tokenId];

		uint8 healingPower = characterPower[_tokenId][userAbility.abilityType];
		uint16 currentHealth = playerStatus[_tokenId][currentNonce].health;

		uint16(healingPower) + currentHealth >= baseHealth[_tokenId] ? playerStatus[_tokenId][currentNonce].health = baseHealth[_tokenId] :
			playerStatus[_tokenId][currentNonce].health+=uint16(healingPower);

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
		numMobAbils > 1 ? _mobAttackPlayer(_tokenId, _target, uint256(keccak256(abi.encodePacked(currentRandomSeed[_tokenId], block.timestamp, playerStatus[_tokenId][_nonce].health))) % numMobAbils) : _mobAttackPlayer(_tokenId, _target, 0);
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

	function endExploreLoot(uint256 _tokenId) external virtual controlsCharacter(_tokenId) isLootTurn(_tokenId) turnActive(_tokenId) {
		_endTurn(_tokenId, playerNonce[_tokenId]);
	}

	function _endTurn(uint256 _tokenId, uint256 _currentNonce) internal {

		turnInProgress[_tokenId] = false;
		playerTurn[_tokenId]++;

		if(playerTurn[_tokenId] > numberOfTurns) {
			_endCampaign(_tokenId, true);
		} else {
			playerStatus[_tokenId][_currentNonce].health = baseHealth[_tokenId];
			emit TurnCompleted(_tokenId);
		}
	}

	function _getDamageTotal(uint256 _tokenId, FantasyThings.AbilityType _attackType, uint256 _target, uint8 _damageBase) internal view returns(uint8) {

		uint256 currentNonce = playerNonce[_tokenId];
		uint8 dmgTotal;

		uint256 PRNG = uint256(keccak256(abi.encodePacked(currentRandomSeed[_tokenId], playerStatus[_tokenId][currentNonce].health, block.timestamp)));

		//Reduction = Base * (1 - Resistance/3*Max Resistance)
		//Chance of block/dodge/full resist = Resistance/5*Max Resistance * Resistance/AttackBase
		//For equally strong attack/defend stats, this gives a 1/5 chance of blocking/dodging/full resisting at max resistance

		if(_attackType == FantasyThings.AbilityType.Strength || _attackType == FantasyThings.AbilityType.Agility){
			uint256 dodgeChance = _dodgeChanceMob(_tokenId, _target, _damageBase);
			if(PRNG % 100000 <= dodgeChance) {return 0;}
			uint256 blockChance = _blockChanceMob(_tokenId, _target, _damageBase);
			if(PRNG % 100000 <= blockChance) {return 0;}
			dmgTotal = _damageReduceArmorMob(_tokenId, _target, _damageBase);
		} else {
			uint256 resistChance = _spellResistChanceMob(_tokenId, _target, _damageBase);
			if(PRNG % 100000 <= resistChance) {return 0;}
			dmgTotal = _damageReduceSpellMob(_tokenId, _target, _damageBase);
		}
		return dmgTotal;
	}

	function _dodgeChanceMob(uint256 _tokenId, uint256 _target, uint8 _baseDamage) internal view returns(uint256) {
		uint256 currentTurn = playerTurn[_tokenId];
		uint256 currentNonce = playerNonce[_tokenId];
		uint8 mobAgil = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].agility;
		return uint256(mobAgil)*1000/(5*255) *  (uint256(mobAgil)*100)/_baseDamage;
	}

	function _blockChanceMob(uint256 _tokenId, uint256 _target, uint8 _baseDamage) internal view returns(uint256) {
		uint256 currentTurn = playerTurn[_tokenId];
		uint256 currentNonce = playerNonce[_tokenId];
		uint8 mobBlock = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].physicalblock;
		return uint256(mobBlock)*1000/(5*255) *  (uint256(mobBlock)*100)/_baseDamage;
	}

	function _spellResistChanceMob(uint256 _tokenId, uint256 _target, uint8 _baseDamage) internal view returns(uint256) {
		uint256 currentTurn = playerTurn[_tokenId];
		uint256 currentNonce = playerNonce[_tokenId];
		uint8 mobSpellResist = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].spellresistance;
		return uint256(mobSpellResist)*1000/(5*255) *  (uint256(mobSpellResist)*100)/_baseDamage;
	}

	function _damageReduceArmorMob(uint256 _tokenId, uint256 _target, uint8 _baseDamage) internal view returns(uint8) {
		uint256 currentTurn = playerTurn[_tokenId];
		uint256 currentNonce = playerNonce[_tokenId];
		uint8 mobArmor = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].armor;
		return uint8((_baseDamage * (1000 - (uint256(mobArmor)*1000)/(3*255)))/1000);
	}

	function _damageReduceSpellMob(uint256 _tokenId, uint256 _target, uint8 _baseDamage) internal view returns(uint8) {
		uint256 currentTurn = playerTurn[_tokenId];
		uint256 currentNonce = playerNonce[_tokenId];
		uint8 mobSpellResistance = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_target].spellresistance;
		return uint8((_baseDamage * (1000 - (uint256(mobSpellResistance)*1000)/(3*255)))/1000);
	}

	function _mobAttackPlayer(uint256 _tokenId, uint256 _mobIndex, uint256 _mobAbilityIndex) internal {
	  uint256 currentNonce = playerNonce[_tokenId];
	  uint256 currentTurn = playerTurn[_tokenId];
	  FantasyThings.Ability memory mobAbility = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].abilities[_mobAbilityIndex];
	  uint8 baseDamage;
	  uint8 totalDamage;
	  if (mobAbility.abilityType == FantasyThings.AbilityType.Strength) {
			baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].strength;
	  		totalDamage = _getDamageToPlayerPhysical(_tokenId, baseDamage);
	  } else if (mobAbility.abilityType == FantasyThings.AbilityType.Agility) {
			baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].agility;
			totalDamage = _getDamageToPlayerPhysical(_tokenId, baseDamage);
	  } else {
		   baseDamage = combatTurnToMobs[_tokenId][currentNonce][currentTurn][_mobIndex].spellpower;
			totalDamage = _getDamageToPlayerSpell(_tokenId, baseDamage);
		}

		totalDamage >= playerStatus[_tokenId][currentNonce].health ? playerStatus[_tokenId][currentNonce].health = 0 : playerStatus[_tokenId][currentNonce].health -= totalDamage;
     }

	function _getDamageToPlayerPhysical(uint256 _tokenId, uint8 _baseDamage) internal view returns(uint8) {

		//block and dodge chance
		uint256 currentNonce = playerNonce[_tokenId];
		uint256 PRNG = uint256(keccak256(abi.encodePacked(currentRandomSeed[_tokenId], playerStatus[_tokenId][currentNonce].health, block.timestamp)));

		uint8 playerAgil = playerStatus[_tokenId][currentNonce].agility;
		uint256 dodgeChance = uint256(playerAgil)*1000/(5*255) *  (uint256(playerAgil)*100)/_baseDamage;
		if(PRNG % 100000 <= dodgeChance) {return 0;}

		uint8 playerBlock = playerStatus[_tokenId][currentNonce].physicalblock;
		uint256 blockChance = uint256(playerBlock)*1000/(5*255) *  (uint256(playerBlock)*100)/_baseDamage;
		if(PRNG % 100000 <= blockChance) {return 0;}

		uint8 playerArmor = playerStatus[_tokenId][currentNonce].armor;
		return uint8((_baseDamage * (1000 - (uint256(playerArmor)*1000)/(3*255)))/1000);
	}

   function _getDamageToPlayerSpell(uint256 _tokenId, uint8 _baseDamage) internal view returns(uint8) {

		uint256 currentNonce = playerNonce[_tokenId];
		uint256 PRNG = uint256(keccak256(abi.encodePacked(currentRandomSeed[_tokenId], playerStatus[_tokenId][currentNonce].health, block.timestamp)));

		uint8 playerSpellResist = playerStatus[_tokenId][currentNonce].spellresistance;
		uint256 resistChance = uint256(playerSpellResist)*1000/(5*255) *  (uint256(playerSpellResist)*100)/_baseDamage;
		if(PRNG % 100000 <= resistChance) {return 0;}

		return uint8((_baseDamage * (1000 - (uint256(playerSpellResist)*1000)/(3*255)))/1000);
	}

	function abandonCampaign(uint256 _tokenId) external controlsCharacter(_tokenId) {
		_endCampaign(_tokenId, false);
	}

	function _endCampaign(uint256 _tokenId, bool _campaignSuccess) internal {
		playerTurn[_tokenId] = 0;
		turnInProgress[_tokenId] = false;
		playerNonce[_tokenId]++;
		emit CampaignEnded(_tokenId, _campaignSuccess);
	}

	function getMobsForTurn(uint256 _tokenId, uint256 _turnNum) public view returns(FantasyThings.Mob[] memory) {
		return combatTurnToMobs[_tokenId][playerNonce[_tokenId]][_turnNum];
	}

	function getInventory(uint256 _tokenId) external view returns(FantasyThings.Item[] memory) {
		return campaignInventory[_tokenId][playerNonce[_tokenId]];
	}

	function enterCampaign(uint256 _tokenId) external virtual;
	function generateTurn(uint256 _tokenId) external virtual;

}
