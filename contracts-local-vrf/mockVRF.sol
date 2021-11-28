//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//this contract just produces a psuedo random number used for local testing
//NOT SECURE FOR ANYTHING ON CHAIN

interface ICastleCampaign {
	function mockFulfillRandomness(bytes32 requestId, uint256 randomness) external;
}

contract MockVRF {

	ICastleCampaign campaignContract;

	constructor() {}

	function requestRandomness(uint256 _num, string calldata _letters, bytes32 _requestId) external {
		 uint256 randomness = uint256(keccak256(abi.encodePacked(msg.sender,_num,_letters)));
		 campaignContract.mockFulfillRandomness(_requestId, randomness);
	}

	function setCampaignAddress(address _campaignAddress) external {
		campaignContract = ICastleCampaign(_campaignAddress);
	}

}