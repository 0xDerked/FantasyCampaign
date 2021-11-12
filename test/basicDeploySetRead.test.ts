import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import chai from "chai";
chai.use(solidity);
const { expect } = chai;
import "@nomiclabs/hardhat-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { FantasyCharacter,FantasyAttributesManager, FantasyCharacter__factory, FantasyAttributesManager__factory} from "../typechain";
import { isExportDeclaration } from "typescript";

let owner:SignerWithAddress;
let user1:SignerWithAddress;
let user2:SignerWithAddress;
let user3:SignerWithAddress;
let user4:SignerWithAddress;
let user5:SignerWithAddress;
let user6:SignerWithAddress;
let user7:SignerWithAddress;
let FantasyCharacterContract:FantasyCharacter;
let FantasyAttributesManagerContract:FantasyAttributesManager;

describe("Basic deploy test, create and read some values", function () {
  before(async function () {
    //deploy the contracts and get the addresses before tests
    [owner, user1, user2, user3, user4, user5, user6, user7] = await ethers.getSigners();

    const FantastyCharacterFactory = new FantasyCharacter__factory(owner);
    FantasyCharacterContract = await FantastyCharacterFactory.deploy();
    await FantasyCharacterContract.deployed();

	 const FantasyAttributesFactory = new FantasyAttributesManager__factory(owner);
	 FantasyAttributesManagerContract = await FantasyAttributesFactory.deploy(FantasyCharacterContract.address);
	 await FantasyAttributesManagerContract.deployed();

	 await FantasyCharacterContract.setStatsManager(FantasyAttributesManagerContract.address);

  });

  it("Mints a Knight and reads the proper values initialized from the manager and NFT ownership", async () => {
	  await FantasyCharacterContract.connect(user1).createCharacter(0);
	  expect(await FantasyCharacterContract.ownerOf(0)).to.equal(user1.address);
	  const knightAttributes = await FantasyAttributesManagerContract.connect(user1).s_CharacterAttributes(0);
	  expect(knightAttributes.experience).to.equal(0);
	  expect(knightAttributes.health).to.equal(100);
	  expect(knightAttributes.strength).to.equal(20);
	  expect(knightAttributes.armor).to.equal(30);
	  expect(knightAttributes.physicalblock).to.equal(25);
	  expect(knightAttributes.agility).to.equal(15);
	  expect(knightAttributes.spellpower).to.equal(0);
	  expect(knightAttributes.spellresistance).to.equal(5);
	  expect(knightAttributes.healingpower).to.equal(0);
	  expect(knightAttributes.class).to.equal(0);
	  const knightAbilities = await FantasyAttributesManagerContract.connect(user1).getAbilities(0);
	  expect(knightAbilities[0].abilityType).to.equal(0);
	  expect(knightAbilities[0].name).to.equal("Strike");
	  expect(await FantasyCharacterContract.currentTokenId()).to.equal(1);
  });

  it("Mints a Warlord and reads the proper values initialized from the manager and NFT ownership", async () => {
	await FantasyCharacterContract.connect(user2).createCharacter(1);
	expect(await FantasyCharacterContract.ownerOf(1)).to.equal(user2.address);
	const WarlordAttributes = await FantasyAttributesManagerContract.connect(user2).s_CharacterAttributes(1);
	expect(WarlordAttributes.experience).to.equal(0);
	expect(WarlordAttributes.health).to.equal(100);
	expect(WarlordAttributes.strength).to.equal(30);
	expect(WarlordAttributes.armor).to.equal(20);
	expect(WarlordAttributes.physicalblock).to.equal(20);
	expect(WarlordAttributes.agility).to.equal(20);
	expect(WarlordAttributes.spellpower).to.equal(0);
	expect(WarlordAttributes.spellresistance).to.equal(5);
	expect(WarlordAttributes.healingpower).to.equal(0);
	expect(WarlordAttributes.class).to.equal(1);
	const WarlordAbilities = await FantasyAttributesManagerContract.connect(user1).getAbilities(1);
	expect(WarlordAbilities[0].abilityType).to.equal(0);
	expect(WarlordAbilities[0].name).to.equal("Strike");
	expect(await FantasyCharacterContract.currentTokenId()).to.equal(2);
});

it("Mints a Wizard and reads the proper values initialized from the manager and NFT ownership", async () => {
	await FantasyCharacterContract.connect(user3).createCharacter(2);
	expect(await FantasyCharacterContract.ownerOf(2)).to.equal(user3.address);
	const WizardAttributes = await FantasyAttributesManagerContract.connect(user3).s_CharacterAttributes(2);
	expect(WizardAttributes.experience).to.equal(0);
	expect(WizardAttributes.health).to.equal(90);
	expect(WizardAttributes.strength).to.equal(5);
	expect(WizardAttributes.armor).to.equal(10);
	expect(WizardAttributes.physicalblock).to.equal(5);
	expect(WizardAttributes.agility).to.equal(5);
	expect(WizardAttributes.spellpower).to.equal(30);
	expect(WizardAttributes.spellresistance).to.equal(20);
	expect(WizardAttributes.healingpower).to.equal(0);
	expect(WizardAttributes.class).to.equal(2);
	const WizardAbilities = await FantasyAttributesManagerContract.connect(user3).getAbilities(2);
	expect(WizardAbilities[0].abilityType).to.equal(4);
	expect(WizardAbilities[0].name).to.equal("Fireball");
	expect(await FantasyCharacterContract.currentTokenId()).to.equal(3);
});

it("Mints a Shaman and reads the proper values initialized from the manager and NFT ownership", async () => {
	await FantasyCharacterContract.connect(user4).createCharacter(3);
	expect(await FantasyCharacterContract.ownerOf(3)).to.equal(user4.address);
	const ShamanAttributes = await FantasyAttributesManagerContract.s_CharacterAttributes(3);
	expect(ShamanAttributes.experience).to.equal(0);
	expect(ShamanAttributes.health).to.equal(90);
	expect(ShamanAttributes.strength).to.equal(10);
	expect(ShamanAttributes.armor).to.equal(15);
	expect(ShamanAttributes.physicalblock).to.equal(10);
	expect(ShamanAttributes.agility).to.equal(10);
	expect(ShamanAttributes.spellpower).to.equal(20);
	expect(ShamanAttributes.spellresistance).to.equal(15);
	expect(ShamanAttributes.healingpower).to.equal(10);
	expect(ShamanAttributes.class).to.equal(3);
	const ShamanAbilities = await FantasyAttributesManagerContract.getAbilities(3);
	expect(ShamanAbilities[0].abilityType).to.equal(4);
	expect(ShamanAbilities[0].name).to.equal("Lightning Bolt");
	expect(ShamanAbilities[1].abilityType).to.equal(6);
	expect(ShamanAbilities[1].name).to.equal("Nature Heal");
	expect(await FantasyCharacterContract.currentTokenId()).to.equal(4);
});

it("Mints a Cleric and reads the proper values initialized from the manager and NFT ownership", async () => {
	await FantasyCharacterContract.connect(user5).createCharacter(4);
	expect(await FantasyCharacterContract.ownerOf(4)).to.equal(user5.address);
	const ClericAttributes = await FantasyAttributesManagerContract.s_CharacterAttributes(4);
	expect(ClericAttributes.experience).to.equal(0);
	expect(ClericAttributes.health).to.equal(120);
	expect(ClericAttributes.strength).to.equal(5);
	expect(ClericAttributes.armor).to.equal(10);
	expect(ClericAttributes.physicalblock).to.equal(5);
	expect(ClericAttributes.agility).to.equal(5);
	expect(ClericAttributes.spellpower).to.equal(10);
	expect(ClericAttributes.spellresistance).to.equal(30);
	expect(ClericAttributes.healingpower).to.equal(30);
	expect(ClericAttributes.class).to.equal(4);
	const ClericAbilities = await FantasyAttributesManagerContract.getAbilities(4);
	expect(ClericAbilities[0].abilityType).to.equal(4);
	expect(ClericAbilities[0].name).to.equal("Smite");
	expect(ClericAbilities[1].abilityType).to.equal(6);
	expect(ClericAbilities[1].name).to.equal("Angel's Blessing");
	expect(await FantasyCharacterContract.currentTokenId()).to.equal(5);
});

it("Mints another Knight and reads the proper values initialized from the manager and NFT ownership", async () => {
	await FantasyCharacterContract.connect(user2).createCharacter(0);
	expect(await FantasyCharacterContract.ownerOf(5)).to.equal(user2.address);
	const knightAttributes = await FantasyAttributesManagerContract.s_CharacterAttributes(5);
	expect(knightAttributes.experience).to.equal(0);
	expect(knightAttributes.health).to.equal(100);
	expect(knightAttributes.strength).to.equal(20);
	expect(knightAttributes.armor).to.equal(30);
	expect(knightAttributes.physicalblock).to.equal(25);
	expect(knightAttributes.agility).to.equal(15);
	expect(knightAttributes.spellpower).to.equal(0);
	expect(knightAttributes.spellresistance).to.equal(5);
	expect(knightAttributes.healingpower).to.equal(0);
	expect(knightAttributes.class).to.equal(0);
	const knightAbilities = await FantasyAttributesManagerContract.getAbilities(5);
	expect(knightAbilities[0].abilityType).to.equal(0);
	expect(knightAbilities[0].name).to.equal("Strike");
	expect(await FantasyCharacterContract.currentTokenId()).to.equal(6);
});

it("Mints a Rogue and reads the proper values initialized from the manager and NFT ownership", async () => {
	await FantasyCharacterContract.connect(user4).createCharacter(5);
	expect(await FantasyCharacterContract.ownerOf(6)).to.equal(user4.address);
	const RogueAttributes = await FantasyAttributesManagerContract.s_CharacterAttributes(6);
	expect(RogueAttributes.experience).to.equal(0);
	expect(RogueAttributes.health).to.equal(100);
	expect(RogueAttributes.strength).to.equal(15);
	expect(RogueAttributes.armor).to.equal(15);
	expect(RogueAttributes.physicalblock).to.equal(15);
	expect(RogueAttributes.agility).to.equal(30);
	expect(RogueAttributes.spellpower).to.equal(0);
	expect(RogueAttributes.spellresistance).to.equal(5);
	expect(RogueAttributes.healingpower).to.equal(0);
	expect(RogueAttributes.class).to.equal(5);
	const RogueAbilities = await FantasyAttributesManagerContract.getAbilities(6);
	expect(RogueAbilities[0].abilityType).to.equal(3);
	expect(RogueAbilities[0].name).to.equal("Stab");
	expect(await FantasyCharacterContract.currentTokenId()).to.equal(7);
});

it("Mints a Ranger and reads the proper values initialized from the manager and NFT ownership", async () => {
	await FantasyCharacterContract.connect(user7).createCharacter(6);
	expect(await FantasyCharacterContract.ownerOf(7)).to.equal(user7.address);
	const RangerAttributes = await FantasyAttributesManagerContract.s_CharacterAttributes(7);
	expect(RangerAttributes.experience).to.equal(0);
	expect(RangerAttributes.health).to.equal(100);
	expect(RangerAttributes.strength).to.equal(10);
	expect(RangerAttributes.armor).to.equal(15);
	expect(RangerAttributes.physicalblock).to.equal(10);
	expect(RangerAttributes.agility).to.equal(35);
	expect(RangerAttributes.spellpower).to.equal(0);
	expect(RangerAttributes.spellresistance).to.equal(5);
	expect(RangerAttributes.healingpower).to.equal(0);
	expect(RangerAttributes.class).to.equal(6);
	const RangerAbilities = await FantasyAttributesManagerContract.getAbilities(7);
	expect(RangerAbilities[0].abilityType).to.equal(3);
	expect(RangerAbilities[0].name).to.equal("Fire Bow");
	expect(await FantasyCharacterContract.currentTokenId()).to.equal(8);
});
});
