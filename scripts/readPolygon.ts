import { ethers } from "hardhat";
import { getHeapStatistics } from "v8";

import {
  FantasyCharacter__factory,
  FantasyAttributesManager__factory,
  CastleCampaign__factory,
  MockVRF__factory,
} from "../typechain";

import { FantasyCharacter } from "../typechain";

const main = async () => {
  const [owner, user1, user2] = await ethers.getSigners();

  const FantasyCharAddress = "0x8b4bF31d1e528e3a316dB7650CB971b2503afb12";
  const attributesAddress = "0x20ad458c2db93cae343755D5A13044BcF6421e36";
  const campaignAddress = "0xD7597560b02adC18fc18FE9A0DED9e6BBFb8b3Ef";

  const FantasyCharacterContract = FantasyCharacter__factory.connect(
    FantasyCharAddress,
    owner
  );

  const attributesContract = FantasyAttributesManager__factory.connect(
    attributesAddress,
    owner
  );

  const campaignContract = CastleCampaign__factory.connect(
    campaignAddress,
    owner
  );

  //const turnNums = await campaignContract.numberOfTurns();

  //user1 mint a warlord
  //const mint = await FantasyCharacterContract.connect(user1).createCharacter(1);
  //await mint.wait();

  //const checkOwner = await FantasyCharacterContract.ownerOf(0);

  //   const checkWarlord = await attributesContract.getPlayer(0);
  //   console.log(checkWarlord);

  //   const ownerWarlord = await FantasyCharacterContract.ownerOf(0);
  //   console.log(ownerWarlord);

  //   const ownerOfOne = await FantasyCharacterContract.ownerOf(1);
  //   console.log(ownerOfOne);

  //   const turn = await campaignContract.playerTurn(0);
  //   console.log(ethers.utils.formatEther(turn));

  //enter campaign
  //   const enter = await campaignContract.connect(user1).enterCampaign(0);
  //   await enter.wait();
  //   console.log(enter);

  //   const turn1 = await campaignContract.playerTurn(0);
  //   console.log("Turn Number: ", turn1.toNumber());

  //const generateTurn = await campaignContract.connect(user1).generateTurn(0);
  //await generateTurn.wait();

  //   const turnType = await campaignContract.turnTypes(0, 1);
  //   const mobsAlive = await campaignContract.turnNumMobsAlive(0, 1);

  //   const turnType1 = await campaignContract.turnTypes(1, 1);
  //   const mobsAlive1 = await campaignContract.turnNumMobsAlive(1, 1);

  //   console.log("Turn Type: ", turnType); //expect 1
  //   console.log("Mobs Alive: ", mobsAlive.toNumber()); //expect 1 or 2

  //   console.log("Turn Type 2: ", turnType1); //expect 1
  //   console.log("Mobs Alive 2: ", mobsAlive1.toNumber()); //expect 1 or 2

  const getPlayerStats = async (tokenId: number) => {
    const stats = await campaignContract.getCurrentCampaignStats(tokenId);
    return stats;
  };

  const getMobStats = async (tokenId: number) => {
    const playerTurn = await campaignContract.playerTurn(tokenId);
    const mobStats = await campaignContract.getMobsForTurn(tokenId, playerTurn);
    return mobStats;
  };

  const turnIP = await campaignContract.turnInProgress(0);
  console.log(turnIP);

  const turnNum = await campaignContract.playerTurn(0);
  console.log(turnNum.toNumber());

  //   const attack = await campaignContract
  //     .connect(user1)
  //     .attackWithAbility(0, 0, 0);
  //   await attack.wait();

  //const mobs = await getMobStats(0);
  //console.log("Mob health: ", mobs[0].health);
  const myStats = await getPlayerStats(0);
  console.log("My stats: ", myStats);

  const baseHealth = await campaignContract.baseHealth();
  console.log(baseHealth);

  const attributesPlayer = await attributesContract.getPlayer(0);
  console.log(attributesPlayer.health);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
