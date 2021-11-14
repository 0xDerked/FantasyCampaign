//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

enum CharacterClass {
			Knight,
			Warlord,
			Wizard,
			Shaman,
			Cleric,
			Rogue,
			Ranger
	}

interface IFantasyAttributesManager {
	  function registerNewCharacter(uint256 _tokenId, CharacterClass _charClass) external;
}

contract FantasyCharacter is ERC721URIStorage,Ownable {

	constructor() ERC721("Fantasy Campaign Character", "FCC") {}

	mapping(uint256 => bool) private s_tokenURIset;
	mapping(uint256 => bool) private s_classTokenURIset;
	mapping(uint256 => string) private s_classTokenURI;
	mapping(address => uint256[]) private s_allCharacters;

	IFantasyAttributesManager public s_StatsManager;
	address public s_StatsManagerAddress;
	uint256 public currentTokenId;

	function createCharacter(CharacterClass _charClass) public {
		_safeMint(msg.sender, currentTokenId);
		s_StatsManager.registerNewCharacter(currentTokenId, _charClass);
		s_allCharacters[msg.sender].push(currentTokenId);
		currentTokenId++;
	}

	//probably want a better flow for this eventually, but keeping the flex for now
	function setStatsManager(address _statsManagerAddress) external onlyOwner {
		s_StatsManagerAddress = _statsManagerAddress;
		s_StatsManager = IFantasyAttributesManager(s_StatsManagerAddress);
	}

}