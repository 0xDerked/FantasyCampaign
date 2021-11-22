import { ethers } from "hardhat";

import {
  FantasyCharacter__factory,
  FantasyAttributesManager__factory,
  CastleCampaign__factory,
  MockVRF__factory,
} from "../typechain";

const main = async () => {
  const [owner] = await ethers.getSigners();
  const FantastyCharacterFactory = new FantasyCharacter__factory(owner);
  const FantasyCharacterContract = await FantastyCharacterFactory.deploy();
  await FantasyCharacterContract.deployed();

  console.log(
    "Fantasy Character ERC721 Address: ",
    FantasyCharacterContract.address
  );

  const FantasyAttributesFactory = new FantasyAttributesManager__factory(owner);
  const FantasyAttributesManagerContract =
    await FantasyAttributesFactory.deploy(FantasyCharacterContract.address);
  await FantasyAttributesManagerContract.deployed();

  const setStats = await FantasyCharacterContract.setStatsManager(
    FantasyAttributesManagerContract.address
  );

  await setStats.wait();

  console.log(
    "Fantasy Attributes Manager Address: ",
    FantasyAttributesManagerContract.address
  );

  const MockVRFFactory = new MockVRF__factory(owner);
  const MockVRFContract = await MockVRFFactory.deploy();
  await MockVRFContract.deployed();

  const CastleCampaignFactory = new CastleCampaign__factory(owner);
  const CastleCampaignContract = await CastleCampaignFactory.deploy(
    FantasyCharacterContract.address,
    MockVRFContract.address,
    FantasyAttributesManagerContract.address,
    5
  );
  await CastleCampaignContract.deployed();

  console.log(
    "Castle Campaign Contract Address: ",
    CastleCampaignContract.address
  );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
