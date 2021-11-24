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
  console.log(owner.address);
  console.log(user1.address);
  console.log(user2.address);

  //const FantasyCharacterFactory = new FantasyCharacter__factory(owner);
  //   const deployTx = FantasyCharacterFactory.getDeployTransaction();
  //   const gas = await owner.estimateGas(deployTx);
  //   console.log(ethers.utils.formatUnits(gas, "ether"));
  //   //console.log(deployTx);
  //   const FantasyCharacterContract = await FantasyCharacterFactory.deploy();
  //   await FantasyCharacterContract.deployed();

  //   console.log(
  //     "Fantasy Character ERC721 Address: ",
  //     FantasyCharacterContract.address
  //   );

  const FantasyCharAddress = "0x8b4bF31d1e528e3a316dB7650CB971b2503afb12";
  const attributesAddress = "0x20ad458c2db93cae343755D5A13044BcF6421e36";
  const campaignAddress = "0x07F1988015197bc49bF30851c0221656ec50C740";

  //   const FantasyAttributesFactory = new FantasyAttributesManager__factory(owner);
  //   const FantasyAttributesManagerContract =
  //     await FantasyAttributesFactory.deploy(FantasyCharAddress);
  //   await FantasyAttributesManagerContract.deployed();

  const FantasyCharacterContract = FantasyCharacter__factory.connect(
    FantasyCharAddress,
    owner
  );

  const attributesContract = FantasyAttributesManager__factory.connect(
    attributesAddress,
    owner
  );

  //   const setStats = await FantasyCharacterContract.setStatsManager(
  //     FantasyAttributesManagerContract.address
  //   );

  //   await setStats.wait();

  //   const CastleCampaignFactory = new CastleCampaign__factory(owner);
  //   const CastleCampaignContract = await CastleCampaignFactory.deploy(
  //     FantasyCharAddress,
  //     attributesAddress,
  //     4
  //   );
  //   await CastleCampaignContract.deployed();

  //   console.log(
  //     "Castle Campaign Contract Address: ",
  //     CastleCampaignContract.address
  //   );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
