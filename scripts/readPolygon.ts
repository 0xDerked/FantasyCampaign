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
  const campaignAddress = "0x336e815f1bdB7Ce11F165822C2f62b9716DaeEaC";

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

  const getPlayerStats = async (tokenId: number) => {
    const stats = await campaignContract.getCurrentCampaignStats(tokenId);
    return stats;
  };

  const getMobStats = async (tokenId: number) => {
    const playerTurn = await campaignContract.playerTurn(tokenId);
    const mobStats = await campaignContract.getMobsForTurn(tokenId, playerTurn);
    return mobStats;
  };

  const generateTurnContract = async (tokenId: number) => {
    const gt = await campaignContract.connect(user1).generateTurn(tokenId);
    await gt.wait();
  };

  const getPlayerInventory = async (tokenId: number) => {
    const inv = await campaignContract.getInventory(tokenId);
    return inv;
  };

  const attackAbility = async (
    tokenId: number,
    index: number,
    target: number
  ) => {
    const attack = await campaignContract
      .connect(user1)
      .attackWithAbility(tokenId, index, target);
    await attack.wait();
  };

  //const turnNums = await campaignContract.numberOfTurns();

  //user1 mint a warlord
  //const mint = await FantasyCharacterContract.connect(user1).createCharacter(1);
  //await mint.wait();

  //  const checkWarlord = await attributesContract.getPlayer(0);
  //  console.log(checkWarlord);

  const ownerWarlord = await FantasyCharacterContract.ownerOf(0);
  console.log(ownerWarlord);

  const ownerOfOne = await FantasyCharacterContract.ownerOf(1);
  console.log(ownerOfOne);

  //   const turn = await campaignContract.playerTurn(0);
  //   console.log(ethers.utils.formatEther(turn));

  //  const enter = await campaignContract.connect(user1).enterCampaign(0);
  //  await enter.wait();

  //await generateTurnContract(0);

  //const turnType = await campaignContract.turnTypes(0, 4);

  //console.log("Turn Type: ", turnType); //expect 1

  //await attackAbility(0,0,1);

  //await campaignContract.connect(user1).endExploreLoot(0);

  // const mobs = await getMobStats(0);
  // console.log("Target Health: ", mobs);
  // const myStats = await getPlayerStats(0);
  // console.log("My stats: ", myStats.health);
  // const mobsAlive = await campaignContract.turnNumMobsAlive(0, 4);
  // console.log("Mobs Alive: ", mobsAlive.toNumber()); //expect 1 or 2

  const turnIP = await campaignContract.turnInProgress(0);
  console.log(turnIP);

  const turnNum = await campaignContract.playerTurn(0);
  console.log(turnNum.toNumber());

  const inventory = await campaignContract.getInventory(0);
  console.log("Inventory: ", inventory);

  //   const baseHealth = await campaignContract.baseHealth(0);
  //   console.log(baseHealth);

  //   const attributesPlayer = await attributesContract.getPlayer(0);
  //   console.log(attributesPlayer.health);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
