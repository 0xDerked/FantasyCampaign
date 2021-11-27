//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./FantasyThings.sol";
import "./CastleCampaignItems.sol";
import "./CampaignPlaymaster.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

interface IMockVRF {
	function requestRandomness(uint256 _num, string calldata _letters, bytes32 _requestId) external;
}

contract CastleCampaign is VRFConsumerBase, CampaignPlaymaster, CastleCampaignItems {

	bytes32 public keyHash;
	uint256 public fee;

	mapping(bytes32 => uint256) private requestToTokenId;


	IMockVRF mockVRF;

	constructor(address _fantasyCharacters, address _mockVRF, address _attributesManager, uint256 _numTurns) VRFConsumerBase(
		0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, //vrfCoordinator
      0x326C977E6efc84E512bB9C30f76E30c160eD06FB //LINK token
	) CampaignPlaymaster(_numTurns, _fantasyCharacters, _attributesManager) {
		keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4; //oracle keyhash;
      fee = 0.0001 * 10**18; //0.0001 LINK //link token fee;

		mockVRF = IMockVRF(_mockVRF);

		//set up some mobs
		FantasyThings.Ability[] memory henchmanAbilities = new FantasyThings.Ability[](1);
		henchmanAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Strength, 1,"Attack");
		_setMob(100, [5,10,5,5,0,0,0,20], "Henchman", henchmanAbilities, 0);

		FantasyThings.Ability[] memory bigBossDragonAbilities = new FantasyThings.Ability[](2);
		bigBossDragonAbilities[0] = FantasyThings.Ability(FantasyThings.AbilityType.Spellpower, 1,"Breathe Fire");
		bigBossDragonAbilities[1] = FantasyThings.Ability(FantasyThings.AbilityType.Strength,1, "Tail Whip");
		_setMob(150, [15,20,10,10,20,15,0,100], "Draco", bigBossDragonAbilities, 1);

		//push the items into the campaign
		CampaignItems.push(iceLance);
		CampaignItems.push(scrollOfProtection);
		CampaignItems.push(scrollOfStrength);

		//set up some guaranteed events with the mobs/puzzles/loot and turn types
		//last turn will be a boss fight against the dragon
		turnGuaranteedTypes[_numTurns] = FantasyThings.TurnType.Combat;
		uint256[] memory mobIdsForLast = new uint256[](1);
		mobIdsForLast[0] = 1; //1 corresponds to Draco Id
		combatGuaranteedMobIds[_numTurns] = mobIdsForLast;

		//second to last turn we will find the dragonslayer ice lance
		turnGuaranteedTypes[_numTurns - 1] = FantasyThings.TurnType.Loot;
		uint256[] memory itemIdsForTurn = new uint256[](1);
		itemIdsForTurn[0] = 0;
		lootGuaranteedItemIds[_numTurns - 1] = itemIdsForTurn;
	}

	function enterCampaign(uint256 _tokenId) external override controlsCharacter(_tokenId) {

		require(playerTurn[_tokenId] == 0, "Campaign Previously Started");
		FantasyThings.CharacterAttributes memory playerCopy = attributesManager.getPlayer(_tokenId);
		FantasyThings.CampaignAttributes storage campaignPlayer = playerStatus[_tokenId][playerNonce[_tokenId]];

		//update the campaign attributes and character power

		campaignPlayer.health = playerCopy.health;
		baseHealth = playerCopy.health;

		campaignPlayer.strength = playerCopy.strength;
		characterPower[_tokenId][FantasyThings.AbilityType.Strength] = playerCopy.strength;

		campaignPlayer.armor = playerCopy.armor;
		characterPower[_tokenId][FantasyThings.AbilityType.Armor] = playerCopy.armor;

		campaignPlayer.physicalblock = playerCopy.physicalblock;
		characterPower[_tokenId][FantasyThings.AbilityType.PhysicalBlock] = playerCopy.physicalblock;

		campaignPlayer.agility = playerCopy.agility;
		characterPower[_tokenId][FantasyThings.AbilityType.Agility] = playerCopy.agility;

		campaignPlayer.spellpower = playerCopy.spellpower;
		characterPower[_tokenId][FantasyThings.AbilityType.Spellpower] = playerCopy.spellpower;

		campaignPlayer.spellresistance = playerCopy.spellresistance;
		characterPower[_tokenId][FantasyThings.AbilityType.Spellresistance] = playerCopy.spellresistance;

		campaignPlayer.healingpower = playerCopy.healingpower;
		characterPower[_tokenId][FantasyThings.AbilityType.HealingPower] = playerCopy.healingpower;

		campaignPlayer.class = playerCopy.class;
		for(uint256 i = 0; i < playerCopy.abilities.length; i++){
			campaignPlayer.abilities.push(playerCopy.abilities[i]);
		}

		playerTurn[_tokenId]++;
		emit CampaignStarted(_tokenId);
	}

	function generateTurn(uint256 _tokenId) external override controlsCharacter(_tokenId) {
		require(playerTurn[_tokenId] > 0, "Enter Campaign First");
		require(!turnInProgress[_tokenId], "Turn in progress");

		turnInProgress[_tokenId] = true;
		emit TurnStarted(_tokenId);

		//generate the turn if it's not a guaranteed turn type
		//start the turn for both guaranteed and generated turns
		if(turnGuaranteedTypes[playerTurn[_tokenId]] == FantasyThings.TurnType.NotSet) {
			//In the real VRF, the request Id is returned from the request and we pass different params to request randomness
			bytes32 requestId = keccak256(abi.encodePacked(msg.sender, _tokenId, playerTurn[_tokenId], playerNonce[_tokenId]));
		   //bytes32 requestId = requestRandomness(keyHash, fee);
			requestToTokenId[requestId] = _tokenId;
			mockVRF.requestRandomness(uint256(keccak256(abi.encodePacked(playerTurn[_tokenId],playerNonce[_tokenId]))),"abc",requestId);
		} else {
			turnTypes[_tokenId][playerTurn[_tokenId]]  = turnGuaranteedTypes[playerTurn[_tokenId]];
			if(turnGuaranteedTypes[playerTurn[_tokenId]] == FantasyThings.TurnType.Combat) {
				_setMobsForTurn(_tokenId, combatGuaranteedMobIds[playerTurn[_tokenId]], playerTurn[_tokenId]);
				emit TurnSet(_tokenId);
			} else if (turnGuaranteedTypes[playerTurn[_tokenId]] == FantasyThings.TurnType.Loot) {
				_setItemsForTurn(_tokenId, lootGuaranteedItemIds[playerTurn[_tokenId]]);
				emit TurnSet(_tokenId);
			} else {
				//set puzzle
			}
		}
	}

	function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
		//later for use with the chainlinkVRF
		//can we use some sort of mapping combined with the requestId to do multiple things?!
	}

	//to expose a mock callback for testing VRF process
	function mockFulfillRandomness(bytes32 requestId, uint256 randomness) external {
		uint256 tokenId = requestToTokenId[requestId];
		currentRandomSeed[tokenId] = randomness;

		if(randomness % 100 < 101) {
			//set up combat turn
			uint256[] memory mobIdsForTurn = new uint256[](1);
			for(uint256 i=0; i<mobIdsForTurn.length; i++) {
				mobIdsForTurn[i] = 0; //we could randomly generate this from some sort of data model and spawn rate
			}
			_setMobsForTurn(tokenId,mobIdsForTurn,playerTurn[tokenId]);
			turnTypes[tokenId][playerTurn[tokenId]] = FantasyThings.TurnType.Combat;
			} else if(randomness % 100 < 95) {
				//set up looting turn
				turnTypes[tokenId][playerTurn[tokenId]] = FantasyThings.TurnType.Loot;
			} else {
				//set up puzzle turn
				turnTypes[tokenId][playerTurn[tokenId]] = FantasyThings.TurnType.Puzzle;
			}
		emit TurnSet(tokenId);
	}
}
