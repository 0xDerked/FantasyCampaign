//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FantasyThings.sol";

contract CastleCampaignItems {

  //FantasyThings.Item[] items;

  function item_by_id(uint _id) external pure returns (FantasyThings.Item memory item) {
    if (_id == 1) {
       return FantasyThings.Item(
                   FantasyThings.ItemType.Spell,
                   FantasyThings.AbilityType.Armor,
                   20, 
                   1, 
                   "Scroll of Protection");
    }
  }
}
