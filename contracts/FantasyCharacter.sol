//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/Extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface FantasyAttributesManager {
	  function registerNewCharacter(uint256 _tokenId, uint256 _charClass) external;
}

contract FantasyCharacter is ERC721,Ownable {

	constructor() ERC721("Fantasy Campaign Character", "FCC") {}

	//Knight : 0
	//Warlord : 1
	//Wizard : 2
	//Shaman : 3
	//Cleric : 4
	//Rogue : 5
	//Ranger : 6

	mapping(uint256 => bool) private s_tokenURIset;
	mapping(uint256 => bool) private s_classTokenURIset;
	mapping(uint256 => string) private s_classTokenURI;
	mapping(address => uint256[]) private s_allCharacters;

	FantasyAttributesManager public s_StatsManager;
	address public s_StatsManagerAddress;
	uint256 public currentTokenId;

	function createCharacter(uint256 _charClass) public {
		_safeMint(msg.sender, currentTokenId);
		s_StatsManager.registerNewCharacter(currentTokenId, _charClass);
		s_allCharacters[msg.sender].push(currentTokenId);
		currentTokenId++;
	}

	//probably want a better flow for this eventually, but keeping the flex for now
	function setStatsManager(address _statsManagerAddress) external onlyOwner {
		s_StatsManagerAddress = _statsManagerAddress;
		s_StatsManager = FantasyAttributesManager(s_StatsManagerAddress);
	}

}