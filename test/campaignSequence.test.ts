import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import chai from "chai";
chai.use(solidity);
const { expect } = chai;
import "@nomiclabs/hardhat-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { FantasyCharacter,FantasyAttributesManager, FantasyCharacter__factory, FantasyAttributesManager__factory, CastleCampaign, 
	CastleCampaign__factory, MockVRF__factory, MockVRF} from "../typechain";

let owner:SignerWithAddress;
let user1:SignerWithAddress;
let FantasyCharacterContract:FantasyCharacter;
let FantasyAttributesManagerContract:FantasyAttributesManager;
let CastleCampaignContract:CastleCampaign;
let MockVRFContract:MockVRF;

describe("Deploy contracts, mint character, progress through campaign", function () {
	before(async function () {
	  //deploy the contracts and get the addresses before tests
	  [owner, user1] = await ethers.getSigners();
 
	  const FantastyCharacterFactory = new FantasyCharacter__factory(owner);
	  FantasyCharacterContract = await FantastyCharacterFactory.deploy();
	  await FantasyCharacterContract.deployed();
 
	  const FantasyAttributesFactory = new FantasyAttributesManager__factory(owner);
	  FantasyAttributesManagerContract = await FantasyAttributesFactory.deploy(FantasyCharacterContract.address);
	  await FantasyAttributesManagerContract.deployed();
 
	  await FantasyCharacterContract.setStatsManager(FantasyAttributesManagerContract.address);
 
	  const MockVRFFactory = new MockVRF__factory(owner);
	  MockVRFContract = await MockVRFFactory.deploy();
	  await MockVRFContract.deployed();
 
	  const CastleCampaignFactory = new CastleCampaign__factory(owner);
	  CastleCampaignContract = await CastleCampaignFactory.deploy(FantasyCharacterContract.address, MockVRFContract.address, FantasyAttributesManagerContract.address);
	  await CastleCampaignContract.deployed();
	
	  //mint a wizard for use in campaign
	  await FantasyCharacterContract.connect(user1).createCharacter(2);

 
	});
	
	it("Reads and confirms basic values from the Castle Campagin", async() => {
		const henchmanMob = await CastleCampaignContract.inspectMob(0);
		const bossDragon = await CastleCampaignContract.inspectMob(1);
		expect(henchmanMob.health).to.equal(100);
		expect(henchmanMob.strength).to.equal(5);
		expect(henchmanMob.name).to.equal("Henchman");
		expect(henchmanMob.abilities[0].abilityType).to.equal(0);
		expect(henchmanMob.abilities[0].name).to.equal("Attack");
		expect(bossDragon.health).to.equal(200);
		expect(bossDragon.strength).to.equal(20);
		expect(bossDragon.name).to.equal("Draco");
		expect(bossDragon.abilities[0].abilityType).to.equal(4);
		expect(bossDragon.abilities[0].name).to.equal("Breathe Fire");
		expect(bossDragon.abilities[1].abilityType).to.equal(0);
		expect(bossDragon.abilities[1].name).to.equal("Tail Whip");
		expect(await CastleCampaignContract.numberOfTurns()).to.equal(10);
	});

	it("Enter campaign and correctly updates state", async() => {
		await CastleCampaignContract.connect(user1).enterCampaign(0);
		expect(await CastleCampaignContract.playerTurn(0)).to.equal(1);
		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
		expect(await CastleCampaignContract.turnTypes(0,1)).to.equal(0);
		const user1CampaignStatus = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(user1CampaignStatus.health).to.equal(90);
	});

	it("Generates a turn, changes state, creates expected values", async() => {
		await CastleCampaignContract.connect(user1).generateTurn(0);
		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);
		expect(await CastleCampaignContract.turnTypes(0,1,)).to.equal(1);
	});

	//interact with turn
});