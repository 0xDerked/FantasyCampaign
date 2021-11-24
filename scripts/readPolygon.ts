import { ethers } from "hardhat";

import {
  FantasyCharacter__factory,
  FantasyAttributesManager__factory,
  CastleCampaign__factory,
  MockVRF__factory,
} from "../typechain";

import { FantasyCharacter } from "../typechain";

const main = async () => {
  const [owner, user1, user2] = await ethers.getSigners();
  //console.log(owner.address);
  //console.log(user1.address);
  //console.log(user2.address);

  const FantasyCharAddress = "0x8b4bF31d1e528e3a316dB7650CB971b2503afb12";
  const attributesAddress = "0x20ad458c2db93cae343755D5A13044BcF6421e36";
  const campaignAddress = "0x07F1988015197bc49bF30851c0221656ec50C740";

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

  const checkWarlord = await attributesContract.getPlayer(0);
  console.log(checkWarlord);

  //   const turn = await campaignContract.playerTurn(0);
  //   console.log(ethers.utils.formatEther(turn));

  //enter campaign
  //   const enter = await campaignContract.connect(user1).enterCampaign(0);
  //   await enter.wait();

  const turn1 = await campaignContract.playerTurn(0);
  console.log("Turn Number: ", turn1.toNumber());

  //const generateTurn = await campaignContract.connect(user1).generateTurn(0);
  // await generateTurn.wait();

  const turnType = await campaignContract.turnTypes(0, 1);
  const mobsAlive = await campaignContract.turnNumMobsAlive(0, 1);

  console.log("Turn Type: ", turnType); //expect 1
  console.log("Mobs Alive: ", mobsAlive.toNumber()); //expect 1 or 2
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
