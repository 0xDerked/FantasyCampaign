import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import chai from "chai";
chai.use(solidity);
const { expect } = chai;
import "@nomiclabs/hardhat-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { FantasyCharacter,FantasyAttributesManager, FantasyCharacter__factory, FantasyAttributesManager__factory, CastleCampaign, 
	CastleCampaign__factory, MockVRF__factory, MockVRF} from "../typechain";
import { AbilityStruct } from "../typechain/CampaignPlaymaster";

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
	  CastleCampaignContract = await CastleCampaignFactory.deploy(FantasyCharacterContract.address, MockVRFContract.address, FantasyAttributesManagerContract.address, 5);
	  await CastleCampaignContract.deployed();
	
	  await FantasyCharacterContract.connect(user1).createCharacter(1);

	  await MockVRFContract.setCampaignAddress(CastleCampaignContract.address);
		
	});
	
	it("Reads and confirms basic values from the Castle Campagin", async() => {
		const henchmanMob = await CastleCampaignContract.inspectMob(0);
		const bossDragon = await CastleCampaignContract.inspectMob(1);
		expect(henchmanMob.health).to.equal(100);
		expect(henchmanMob.strength).to.equal(5);
		expect(henchmanMob.name).to.equal("Henchman");
		expect(henchmanMob.abilities[0].abilityType).to.equal(0);
		expect(henchmanMob.abilities[0].name).to.equal("Attack");
		expect(bossDragon.health).to.equal(150);
		expect(bossDragon.strength).to.equal(15);
		expect(bossDragon.name).to.equal("Draco");
		expect(bossDragon.abilities[0].abilityType).to.equal(4);
		expect(bossDragon.abilities[0].name).to.equal("Breathe Fire");
		expect(bossDragon.abilities[1].abilityType).to.equal(0);
		expect(bossDragon.abilities[1].name).to.equal("Tail Whip");
		expect(await CastleCampaignContract.numberOfTurns()).to.equal(5);
		expect(await CastleCampaignContract.playerNonce(0)).to.equal(0);
	});

	it("Enter campaign and correctly updates state", async() => {
		await expect(CastleCampaignContract.connect(user1).enterCampaign(0))
			.to.emit(CastleCampaignContract, "CampaignStarted")
			.withArgs(user1.address,CastleCampaignContract.address,0);
		expect(await CastleCampaignContract.playerTurn(0)).to.equal(1);
		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
		expect(await CastleCampaignContract.turnTypes(0,1)).to.equal(0);
		const user1CampaignStatus = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(user1CampaignStatus.health).to.equal(100);
	});

	it("Generates a turn, changes state, creates expected values", async() => {
		await expect(CastleCampaignContract.connect(user1).generateTurn(0))
			.to.emit(CastleCampaignContract, "TurnStarted")
			.withArgs(CastleCampaignContract.address,0,1,1);
		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);
		expect(await CastleCampaignContract.turnTypes(0,1)).to.equal(1);
		const mobs = await CastleCampaignContract.getMobsForTurn(0,1);
		console.log("Number of Mobs for Turn 1: ", mobs.length);
		expect(mobs.length).to.be.lessThanOrEqual(2);
		expect(mobs[0].strength).to.equal(5);
		expect(mobs[0].health).to.equal(100);
		expect(CastleCampaignContract.connect(user1).generateTurn(0)).to.be.reverted;
	});

	it("Use Strike on first mob, state updates properly", async() => {

		expect(await CastleCampaignContract.characterPower(0,0)).to.equal(30);

		const userCampaignStatusBefore = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusBefore.health).to.equal(100);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
		
		const mobsAfter = await CastleCampaignContract.getMobsForTurn(0,1);
		expect(mobsAfter[0].health).to.equal(71);

		const userCampaignStatusAfter = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter.health).to.equal(97);
	});

	it("Full combat sequence for first turn, state updates properly", async() => {
		const playerTurn = await CastleCampaignContract.playerTurn(0);
		expect(playerTurn).to.equal(1);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);

		const mobsAfter1 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter1[0].health).to.equal(42);

		const userCampaignStatusAfter1 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter1.health).to.equal(94);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);

		const mobsAfter2 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter2[0].health).to.equal(13);

		const userCampaignStatusAfter2 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter2.health).to.equal(91);

		await expect(CastleCampaignContract.connect(user1).attackWithAbility(0,0,0))
				.to.emit(CastleCampaignContract, "TurnCompleted")
				.withArgs(CastleCampaignContract.address,0,1);

		const mobsAfter3 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter3[0].health).to.equal(0);

		const userCampaignStatusAfter3 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter3.health).to.equal(100);

		const playerTurnAfter = await CastleCampaignContract.playerTurn(0);
		expect(await CastleCampaignContract.turnNumMobsAlive(0,playerTurn)).to.equal(0);
		expect(playerTurnAfter).to.equal(2);
		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
	});

	it("Generate turn 2, update state correctly", async() => {
		const playerTurn = await CastleCampaignContract.playerTurn(0);
		
		await expect(CastleCampaignContract.connect(user1).generateTurn(0))
		.to.emit(CastleCampaignContract, "TurnStarted")
		.withArgs(CastleCampaignContract.address,0,playerTurn,1);

		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);

		const generatedMobs = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		console.log("Number of Mobs for Turn 2: ", generatedMobs.length);
		expect(generatedMobs.length).to.be.lessThanOrEqual(2);
		expect(generatedMobs[0].health).to.equal(100);
		expect(generatedMobs[1].health).to.equal(100);

	});

	//The tests are psuedorandom so I know there are 2 mobs here
	it("Execute turn 2, update state correctly", async() => {
		const playerTurn = await CastleCampaignContract.playerTurn(0);
		expect(CastleCampaignContract.connect(user1).generateTurn(0)).to.be.reverted;

		const generatedMobs = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(generatedMobs.length).to.equal(2);
		expect(generatedMobs[0].health).to.equal(100);
		expect(generatedMobs[1].health).to.equal(100);

		/**Begin Kill Mob 1 **/

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);

		const userCampaignStatusAfter1 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter1.health).to.equal(97);

		const mobsAfter = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter[0].health).to.equal(71);
		expect(mobsAfter[1].health).to.equal(100);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);

		const userCampaignStatusAfter2 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter2.health).to.equal(94);

		const mobsAfter2 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter2[0].health).to.equal(42);
		expect(mobsAfter2[1].health).to.equal(100);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);

		const userCampaignStatusAfter3 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter3.health).to.equal(91);

		const mobsAfter3 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter3[0].health).to.equal(13);
		expect(mobsAfter3[1].health).to.equal(100);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);

		//killing mob so health should stay the same
		const userCampaignStatusAfter4 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter4.health).to.equal(91);

		const mobsAfter4 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter4[0].health).to.equal(0);
		expect(mobsAfter4[1].health).to.equal(100);

		/**End Kill Mob 1 **/

		/**Begin Kill Mob 2 **/

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,1);

		const userCampaignStatusAfter5 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter5.health).to.equal(88);

		const mobsAfter5 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter5[0].health).to.equal(0);
		expect(mobsAfter5[1].health).to.equal(71);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,1);

		const userCampaignStatusAfter6 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter6.health).to.equal(85);

		const mobsAfter6 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter6[0].health).to.equal(0);
		expect(mobsAfter6[1].health).to.equal(42);

		await CastleCampaignContract.connect(user1).attackWithAbility(0,0,1);

		const userCampaignStatusAfter7 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter7.health).to.equal(82);

		const mobsAfter7 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		expect(mobsAfter7[0].health).to.equal(0);
		expect(mobsAfter7[1].health).to.equal(13);

		await expect(CastleCampaignContract.connect(user1).attackWithAbility(0,0,1))
			.to.emit(CastleCampaignContract, "TurnCompleted")
			.withArgs(CastleCampaignContract.address, 0, 2);

		//killing last mob so health should reset
		const userCampaignStatusAfter8 = await CastleCampaignContract.getCurrentCampaignStats(0);
		expect(userCampaignStatusAfter8.health).to.equal(100);

		expect(await CastleCampaignContract.playerTurn(0)).to.equal(3);
		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);

		/**End Kill Mob 2 **/

	});

	it("Generate turn 3, update state correctly", async() => {
		const playerTurn = await CastleCampaignContract.playerTurn(0);
		
		await expect(CastleCampaignContract.connect(user1).generateTurn(0))
		.to.emit(CastleCampaignContract, "TurnStarted")
		.withArgs(CastleCampaignContract.address,0,playerTurn,1);

		expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);

		const generatedMobs = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
		console.log("Number of Mobs for Turn 3: ", generatedMobs.length);
		expect(generatedMobs.length).to.be.lessThanOrEqual(2);
		expect(generatedMobs[0].health).to.equal(100);
		expect(generatedMobs[1].health).to.equal(100);

	});

		//The tests are psuedorandom so I know there are 2 mobs here
		it("Execute turn 3, update state correctly", async() => {
			const playerTurn = await CastleCampaignContract.playerTurn(0);
			expect(CastleCampaignContract.connect(user1).generateTurn(0)).to.be.reverted;
	
			/**Begin Kill Mob 1 **/
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const userCampaignStatusAfter1 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter1.health).to.equal(97);
	
			const mobsAfter = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter[0].health).to.equal(71);
			expect(mobsAfter[1].health).to.equal(100);
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const userCampaignStatusAfter2 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter2.health).to.equal(94);
	
			const mobsAfter2 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter2[0].health).to.equal(42);
			expect(mobsAfter2[1].health).to.equal(100);
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const userCampaignStatusAfter3 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter3.health).to.equal(91);
	
			const mobsAfter3 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter3[0].health).to.equal(13);
			expect(mobsAfter3[1].health).to.equal(100);
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			//killing mob so health should stay the same
			const userCampaignStatusAfter4 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter4.health).to.equal(91);
	
			const mobsAfter4 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter4[0].health).to.equal(0);
			expect(mobsAfter4[1].health).to.equal(100);
	
			/**End Kill Mob 1 **/
	
			/**Begin Kill Mob 2 **/
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,1);
	
			const userCampaignStatusAfter5 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter5.health).to.equal(88);
	
			const mobsAfter5 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter5[0].health).to.equal(0);
			expect(mobsAfter5[1].health).to.equal(71);
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,1);
	
			const userCampaignStatusAfter6 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter6.health).to.equal(85);
	
			const mobsAfter6 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter6[0].health).to.equal(0);
			expect(mobsAfter6[1].health).to.equal(42);
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,1);
	
			const userCampaignStatusAfter7 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter7.health).to.equal(82);
	
			const mobsAfter7 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter7[0].health).to.equal(0);
			expect(mobsAfter7[1].health).to.equal(13);
	
			await expect(CastleCampaignContract.connect(user1).attackWithAbility(0,0,1))
				.to.emit(CastleCampaignContract, "TurnCompleted")
				.withArgs(CastleCampaignContract.address, 0, 3);
	
			//killing last mob so health should reset
			const userCampaignStatusAfter8 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter8.health).to.equal(100);
	
			expect(await CastleCampaignContract.playerTurn(0)).to.equal(4);
			expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
	
			/**End Kill Mob 2 **/
	
		});

		it("Generate turn 4, update state correctly", async() => {
			const playerTurn = await CastleCampaignContract.playerTurn(0);
			
			await expect(CastleCampaignContract.connect(user1).generateTurn(0))
			.to.emit(CastleCampaignContract, "TurnStarted")
			.withArgs(CastleCampaignContract.address,0,playerTurn,1);
	
			expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);
	
			const generatedMobs = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			console.log("Number of Mobs for Turn 4: ", generatedMobs.length);
			expect(generatedMobs.length).to.be.lessThanOrEqual(2);
			expect(generatedMobs[0].health).to.equal(100);

		});

		//test is psuedorandom so I know only 1 mob
		it("Execute turn 4, state updates properly", async() => {
			const playerTurn = await CastleCampaignContract.playerTurn(0);
			expect(playerTurn).to.equal(4);
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter1 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter1[0].health).to.equal(71);
	
			const userCampaignStatusAfter1 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter1.health).to.equal(97);
	
			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter2 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter2[0].health).to.equal(42);
	
			const userCampaignStatusAfter2 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter2.health).to.equal(94);

			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter3 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter3[0].health).to.equal(13);
	
			const userCampaignStatusAfter3 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter3.health).to.equal(91);

	
			await expect(CastleCampaignContract.connect(user1).attackWithAbility(0,0,0))
					.to.emit(CastleCampaignContract, "TurnCompleted")
					.withArgs(CastleCampaignContract.address,0,4);
	
			const mobsAfter4 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter4[0].health).to.equal(0);
	
			const userCampaignStatusAfter4 = await CastleCampaignContract.getCurrentCampaignStats(0);
			expect(userCampaignStatusAfter4.health).to.equal(100);
	
			const playerTurnAfter = await CastleCampaignContract.playerTurn(0);
			expect(await CastleCampaignContract.turnNumMobsAlive(0,playerTurn)).to.equal(0);
			expect(playerTurnAfter).to.equal(5);
			expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
		});

		it("Generates final turn, updates state correctly", async() => {

			const playerTurn = await CastleCampaignContract.playerTurn(0);

			await expect(CastleCampaignContract.connect(user1).generateTurn(0))
				.to.emit(CastleCampaignContract, "TurnStarted")
				.withArgs(CastleCampaignContract.address,0,playerTurn,1);
	
			expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);

			const generatedMobs = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(generatedMobs.length).to.equal(1);
			expect(generatedMobs[0].name).to.equal("Draco");
			expect(generatedMobs[0].health).to.equal(150);

		});

		it("Attacks Dragon Boss --- reads back values", async() => {

			const playerTurn = await CastleCampaignContract.playerTurn(0);

			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter1 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter1[0].health).to.equal(122);

			const userCampaignStatusAfter1 = await CastleCampaignContract.getCurrentCampaignStats(0);
			console.log("User health after 1st attack: ", userCampaignStatusAfter1.health);
			console.log("Boss damage from 1st attack: ", 100 - userCampaignStatusAfter1.health);

			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter2 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter2[0].health).to.equal(94);

			const userCampaignStatusAfter2 = await CastleCampaignContract.getCurrentCampaignStats(0);
			console.log("User health after 2nd attack: ", userCampaignStatusAfter2.health);
			console.log("Boss damage from 2nd attack: ", userCampaignStatusAfter1.health - userCampaignStatusAfter2.health);

			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter3 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter3[0].health).to.equal(66);

			const userCampaignStatusAfter3 = await CastleCampaignContract.getCurrentCampaignStats(0);
			console.log("User health after 3rd attack: ", userCampaignStatusAfter3.health);
			console.log("Boss damage from 3rd attack: ", userCampaignStatusAfter2.health - userCampaignStatusAfter3.health);

			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter4 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter4[0].health).to.equal(38);

			const userCampaignStatusAfter4 = await CastleCampaignContract.getCurrentCampaignStats(0);
			console.log("User health after 4th attack: ", userCampaignStatusAfter4.health);
			console.log("Boss damage from 4th attack: ", userCampaignStatusAfter3.health - userCampaignStatusAfter4.health);

			await CastleCampaignContract.connect(user1).attackWithAbility(0,0,0);
	
			const mobsAfter5 = await CastleCampaignContract.getMobsForTurn(0,playerTurn);
			expect(mobsAfter5[0].health).to.equal(10);

			const userCampaignStatusAfter5 = await CastleCampaignContract.getCurrentCampaignStats(0);
			console.log("User health after 5th attack: ", userCampaignStatusAfter5.health);
			console.log("Boss damage from 5th attack: ", userCampaignStatusAfter4.health - userCampaignStatusAfter5.health);

			await expect(CastleCampaignContract.connect(user1).attackWithAbility(0,0,0))
					.to.emit(CastleCampaignContract, "CampaignEnded")
					.withArgs(CastleCampaignContract.address, 0, true);

			expect(await CastleCampaignContract.playerNonce(0)).to.equal(1);
			expect(await CastleCampaignContract.playerTurn(0)).to.equal(0);
			expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);

		});

});