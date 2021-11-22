//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "./FantasyThings.sol";

contract CastleCampaignItems {

	FantasyThings.Item public iceLance;
	FantasyThings.Item public scrollOfProtection;
	FantasyThings.Item public scrollOfStrength;
	FantasyThings.Item public scrollOfSpellpower;

	constructor() {

		iceLance.item = FantasyThings.ItemType.Weapon;
		iceLance.attr = FantasyThings.AbilityType.Strength;
		iceLance.power = 40;
		iceLance.numUses = 1;
		iceLance.name = "Dragonslayer's Ice Lance";

		scrollOfProtection.item = FantasyThings.ItemType.Spell;
		scrollOfProtection.attr = FantasyThings.AbilityType.Armor;
		scrollOfProtection.power = 20;
		scrollOfProtection.numUses = 1;
		scrollOfProtection.name = "Scroll of Protection";

		scrollOfStrength.item = FantasyThings.ItemType.Spell;
		scrollOfStrength.attr = FantasyThings.AbilityType.Strength;
		scrollOfStrength.power = 20;
		scrollOfStrength.numUses = 1;
		scrollOfStrength.name = "Scroll of Strength";

		scrollOfSpellpower.item = FantasyThings.ItemType.Spell;
		scrollOfSpellpower.attr = FantasyThings.AbilityType.Spellpower;
		scrollOfSpellpower.power = 20;
		scrollOfSpellpower.numUses = 1;
		scrollOfSpellpower.name = "Scroll of Spellpower";
	}

}
