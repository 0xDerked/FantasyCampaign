import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import chai from "chai";
chai.use(solidity);
const { expect } = chai;
import "@nomiclabs/hardhat-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  FantasyCharacter,
  FantasyAttributesManager,
  FantasyCharacter__factory,
  FantasyAttributesManager__factory,
  CastleCampaign,
  CastleCampaign__factory,
  MockVRF__factory,
  MockVRF,
} from "../typechain";

let owner: SignerWithAddress;
let user1: SignerWithAddress;
let FantasyCharacterContract: FantasyCharacter;
let FantasyAttributesManagerContract: FantasyAttributesManager;
let CastleCampaignContract: CastleCampaign;
let MockVRFContract: MockVRF;

describe("Deploy contracts, mint character, progress through campaign", function () {
  before(async function () {
    //deploy the contracts and get the addresses before tests
    [owner, user1] = await ethers.getSigners();

    const FantastyCharacterFactory = new FantasyCharacter__factory(owner);
    FantasyCharacterContract = await FantastyCharacterFactory.deploy();
    await FantasyCharacterContract.deployed();

    const FantasyAttributesFactory = new FantasyAttributesManager__factory(
      owner
    );
    FantasyAttributesManagerContract = await FantasyAttributesFactory.deploy(
      FantasyCharacterContract.address
    );
    await FantasyAttributesManagerContract.deployed();

    await FantasyCharacterContract.setStatsManager(
      FantasyAttributesManagerContract.address
    );

    const MockVRFFactory = new MockVRF__factory(owner);
    MockVRFContract = await MockVRFFactory.deploy();
    await MockVRFContract.deployed();

    const CastleCampaignFactory = new CastleCampaign__factory(owner);
    CastleCampaignContract = await CastleCampaignFactory.deploy(
      FantasyCharacterContract.address,
      MockVRFContract.address,
      FantasyAttributesManagerContract.address,
      5
    );
    await CastleCampaignContract.deployed();

    //mints a Knight
    await FantasyCharacterContract.connect(user1).createCharacter(0);

    await MockVRFContract.setCampaignAddress(CastleCampaignContract.address);

    const timestamp = await CastleCampaignContract.blockStampTest();
    console.log("Timestamp: ", ethers.utils.formatUnits(timestamp, "wei"));
  });

  it("Reads and confirms basic values from the Castle Campagin", async () => {
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

  it("Enter campaign and correctly updates state", async () => {
    await expect(CastleCampaignContract.connect(user1).enterCampaign(0))
      .to.emit(CastleCampaignContract, "CampaignStarted")
      .withArgs(user1.address, CastleCampaignContract.address, 0);
    expect(await CastleCampaignContract.playerTurn(0)).to.equal(1);
    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
    expect(await CastleCampaignContract.turnTypes(0, 1)).to.equal(0);
    const user1CampaignStatus =
      await CastleCampaignContract.getCurrentCampaignStats(0);
    expect(user1CampaignStatus.health).to.equal(100);
  });

  it("Generates a turn, changes state, creates expected values", async () => {
    await expect(CastleCampaignContract.connect(user1).generateTurn(0))
      .to.emit(CastleCampaignContract, "TurnStarted")
      .withArgs(CastleCampaignContract.address, 0, 1, 1);
    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);
    expect(await CastleCampaignContract.turnTypes(0, 1)).to.equal(1);
    const mobs = await CastleCampaignContract.getMobsForTurn(0, 1);
    console.log("Number of Mobs for Turn 1: ", mobs.length);
    expect(mobs.length).to.be.lessThanOrEqual(2);
    expect(mobs[0].strength).to.equal(5);
    expect(mobs[0].health).to.equal(100);
    expect(CastleCampaignContract.connect(user1).generateTurn(0)).to.be
      .reverted;
  });

  it("Full combat sequence for first turn, state updates properly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);
    expect(playerTurn).to.equal(1);

    let turnFinished = false;

    while (!turnFinished) {
      await CastleCampaignContract.connect(user1).attackWithAbility(0, 0, 0);
      const mobsAfter = await CastleCampaignContract.getMobsForTurn(
        0,
        playerTurn
      );
      const userCampaignStatusAfter =
        await CastleCampaignContract.getCurrentCampaignStats(0);
      console.log(
        "Turn: ",
        ethers.utils.formatUnits(playerTurn, "wei"),
        " Mob 1 Health: ",
        mobsAfter[0].health
      );
      console.log("Player Health :", userCampaignStatusAfter.health);
      mobsAfter[0].health == 0 ? (turnFinished = true) : (turnFinished = false);
    }

    const playerTurnAfter = await CastleCampaignContract.playerTurn(0);
    expect(
      await CastleCampaignContract.turnNumMobsAlive(0, playerTurn)
    ).to.equal(0);
    expect(playerTurnAfter).to.equal(2);
    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
  });

  it("Generate turn 2, update state correctly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);

    await expect(CastleCampaignContract.connect(user1).generateTurn(0))
      .to.emit(CastleCampaignContract, "TurnStarted")
      .withArgs(CastleCampaignContract.address, 0, playerTurn, 1);

    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);

    const generatedMobs = await CastleCampaignContract.getMobsForTurn(
      0,
      playerTurn
    );
    console.log("Number of Mobs for Turn 2: ", generatedMobs.length);
    expect(generatedMobs.length).to.be.lessThanOrEqual(2);
    expect(generatedMobs[0].health).to.equal(100);
    expect(generatedMobs[1].health).to.equal(100);
  });

  //The tests are psuedorandom so I know there are 2 mobs here
  it("Execute turn 2, update state correctly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);
    expect(CastleCampaignContract.connect(user1).generateTurn(0)).to.be
      .reverted;

    const generatedMobs = await CastleCampaignContract.getMobsForTurn(
      0,
      playerTurn
    );
    expect(generatedMobs.length).to.equal(2);
    expect(generatedMobs[0].health).to.equal(100);
    expect(generatedMobs[1].health).to.equal(100);

    let turnFinished = false;

    while (!turnFinished) {
      await CastleCampaignContract.connect(user1).attackWithAbility(0, 0, 0);
      const mobsAfter = await CastleCampaignContract.getMobsForTurn(
        0,
        playerTurn
      );
      const userCampaignStatusAfter =
        await CastleCampaignContract.getCurrentCampaignStats(0);
      console.log(
        "Turn: ",
        ethers.utils.formatUnits(playerTurn, "wei"),
        " Mob 1 Health: ",
        mobsAfter[0].health
      );
      console.log("Player Health :", userCampaignStatusAfter.health);
      mobsAfter[0].health == 0 ? (turnFinished = true) : (turnFinished = false);
    }

    turnFinished = false;

    while (!turnFinished) {
      await CastleCampaignContract.connect(user1).attackWithAbility(0, 0, 1);
      const mobsAfter = await CastleCampaignContract.getMobsForTurn(
        0,
        playerTurn
      );
      const userCampaignStatusAfter =
        await CastleCampaignContract.getCurrentCampaignStats(0);
      console.log(
        "Turn: ",
        ethers.utils.formatUnits(playerTurn, "wei"),
        " Mob 2 Health: ",
        mobsAfter[1].health
      );
      console.log("Player Health :", userCampaignStatusAfter.health);
      mobsAfter[1].health == 0 ? (turnFinished = true) : (turnFinished = false);
    }

    const playerTurnAfter = await CastleCampaignContract.playerTurn(0);
    expect(
      await CastleCampaignContract.turnNumMobsAlive(0, playerTurn)
    ).to.equal(0);
    expect(playerTurnAfter).to.equal(3);
    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
  });

  it("Generate turn 3, update state correctly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);

    await expect(CastleCampaignContract.connect(user1).generateTurn(0))
      .to.emit(CastleCampaignContract, "TurnStarted")
      .withArgs(CastleCampaignContract.address, 0, playerTurn, 1);

    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);

    const generatedMobs = await CastleCampaignContract.getMobsForTurn(
      0,
      playerTurn
    );
    console.log("Number of Mobs for Turn 3: ", generatedMobs.length);
    expect(generatedMobs.length).to.be.lessThanOrEqual(2);
    expect(generatedMobs[0].health).to.equal(100);
    expect(generatedMobs[1].health).to.equal(100);
  });

  //The tests are psuedorandom so I know there are 2 mobs here
  it("Execute turn 3, update state correctly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);
    expect(CastleCampaignContract.connect(user1).generateTurn(0)).to.be
      .reverted;

    let turnFinished = false;

    while (!turnFinished) {
      await CastleCampaignContract.connect(user1).attackWithAbility(0, 0, 0);
      const mobsAfter = await CastleCampaignContract.getMobsForTurn(
        0,
        playerTurn
      );
      const userCampaignStatusAfter =
        await CastleCampaignContract.getCurrentCampaignStats(0);
      console.log(
        "Turn: ",
        ethers.utils.formatUnits(playerTurn, "wei"),
        " Mob 1 Health: ",
        mobsAfter[0].health
      );
      console.log("Player Health :", userCampaignStatusAfter.health);
      mobsAfter[0].health == 0 ? (turnFinished = true) : (turnFinished = false);
    }

    turnFinished = false;

    while (!turnFinished) {
      await CastleCampaignContract.connect(user1).attackWithAbility(0, 0, 1);
      const mobsAfter = await CastleCampaignContract.getMobsForTurn(
        0,
        playerTurn
      );
      const userCampaignStatusAfter =
        await CastleCampaignContract.getCurrentCampaignStats(0);
      console.log(
        "Turn: ",
        ethers.utils.formatUnits(playerTurn, "wei"),
        " Mob 2 Health: ",
        mobsAfter[1].health
      );
      console.log("Player Health :", userCampaignStatusAfter.health);
      mobsAfter[1].health == 0 ? (turnFinished = true) : (turnFinished = false);
    }

    expect(await CastleCampaignContract.playerTurn(0)).to.equal(4);
    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
  });

  it("Generate turn 4, update state correctly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);

    await expect(CastleCampaignContract.connect(user1).generateTurn(0))
      .to.emit(CastleCampaignContract, "TurnStarted")
      .withArgs(CastleCampaignContract.address, 0, playerTurn, 1);

    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);

    const generatedMobs = await CastleCampaignContract.getMobsForTurn(
      0,
      playerTurn
    );
    console.log("Number of Mobs for Turn 4: ", generatedMobs.length);
    expect(generatedMobs.length).to.be.lessThanOrEqual(2);
    expect(generatedMobs[0].health).to.equal(100);
  });

  //test is psuedorandom so I know only 1 mob
  it("Execute turn 4, state updates properly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);
    expect(playerTurn).to.equal(4);

    let turnFinished = false;

    while (!turnFinished) {
      await CastleCampaignContract.connect(user1).attackWithAbility(0, 0, 0);
      const mobsAfter = await CastleCampaignContract.getMobsForTurn(
        0,
        playerTurn
      );
      const userCampaignStatusAfter =
        await CastleCampaignContract.getCurrentCampaignStats(0);
      console.log(
        "Turn: ",
        ethers.utils.formatUnits(playerTurn, "wei"),
        " Mob 1 Health: ",
        mobsAfter[0].health
      );
      console.log("Player Health :", userCampaignStatusAfter.health);
      mobsAfter[0].health == 0 ? (turnFinished = true) : (turnFinished = false);
    }

    const playerTurnAfter = await CastleCampaignContract.playerTurn(0);
    expect(
      await CastleCampaignContract.turnNumMobsAlive(0, playerTurn)
    ).to.equal(0);
    expect(playerTurnAfter).to.equal(5);
    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
  });

  it("Generates final turn, updates state correctly", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);

    await expect(CastleCampaignContract.connect(user1).generateTurn(0))
      .to.emit(CastleCampaignContract, "TurnStarted")
      .withArgs(CastleCampaignContract.address, 0, playerTurn, 1);

    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(true);

    const generatedMobs = await CastleCampaignContract.getMobsForTurn(
      0,
      playerTurn
    );
    expect(generatedMobs.length).to.equal(1);
    expect(generatedMobs[0].name).to.equal("Draco");
    expect(generatedMobs[0].health).to.equal(150);
  });

  it("Attacks Dragon Boss --- reads back values", async () => {
    const playerTurn = await CastleCampaignContract.playerTurn(0);

    let turnFinished = false;

    while (!turnFinished) {
      await CastleCampaignContract.connect(user1).attackWithAbility(0, 0, 0);
      const bossAfter = await CastleCampaignContract.combatTurnToMobs(
        0,
        0,
        5,
        0
      );
      const userCampaignStatusAfter = await CastleCampaignContract.playerStatus(
        0,
        0
      );
      console.log(
        "Turn: ",
        ethers.utils.formatUnits(playerTurn, "wei"),
        " Mob 1 Health: ",
        bossAfter.health
      );
      console.log("Player Health :", userCampaignStatusAfter.health);
      bossAfter.health == 0 || userCampaignStatusAfter.health == 0
        ? (turnFinished = true)
        : (turnFinished = false);
    }

    expect(await CastleCampaignContract.playerNonce(0)).to.equal(1);
    expect(await CastleCampaignContract.playerTurn(0)).to.equal(0);
    expect(await CastleCampaignContract.turnInProgress(0)).to.equal(false);
  });
});
