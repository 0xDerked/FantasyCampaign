//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//this contract just produces a psuedo random number used for local testing
//NOT SECURE FOR ANYTHING ON CHAIN

contract MockVRF {

	constructor() {}

	function requestRandomness(uint256 _num, string calldata _letters) external view returns(uint256){
		 return uint256(keccak256(abi.encodePacked(msg.sender,_num,_letters)));
	}

}