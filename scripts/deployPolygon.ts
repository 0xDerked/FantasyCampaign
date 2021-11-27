import { ethers } from "hardhat";

import {
  FantasyCharacter__factory,
  FantasyAttributesManager__factory,
  CastleCampaign__factory,
  MockVRF__factory,
  Verifier__factory,
} from "../typechain";

import { FantasyCharacter } from "../typechain";

const main = async () => {
  const [owner, user1, user2] = await ethers.getSigners();

  //const FantasyCharacterFactory = new FantasyCharacter__factory(owner);
  //const deployTx = FantasyCharacterFactory.getDeployTransaction();
  //const gas = await owner.estimateGas(deployTx);
  //console.log(ethers.utils.formatUnits(gas, "ether"));
  //console.log(deployTx);
  //   const FantasyCharacterContract = await FantasyCharacterFactory.deploy();
  //   await FantasyCharacterContract.deployed();

  //   console.log(
  //     "Fantasy Character ERC721 Address: ",
  //     FantasyCharacterContract.address
  //   );

  const FantasyCharAddress = "0x8b4bF31d1e528e3a316dB7650CB971b2503afb12";
  const attributesAddress = "0x20ad458c2db93cae343755D5A13044BcF6421e36";
  const verifierAddress = "0x36d1FeB0926b65191557eb43EcE4a40A83Cf5CdA";
  //const campaignAddress = "0xD7597560b02adC18fc18FE9A0DED9e6BBFb8b3Ef";

  //   const FantasyAttributesFactory = new FantasyAttributesManager__factory(owner);
  //   const FantasyAttributesManagerContract =
  //     await FantasyAttributesFactory.deploy(FantasyCharAddress);
  //   await FantasyAttributesManagerContract.deployed();

  //   const FantasyCharacterContract = FantasyCharacter__factory.connect(
  //     FantasyCharAddress,
  //     owner
  //   );

  //   const attributesContract = FantasyAttributesManager__factory.connect(
  //     attributesAddress,
  // //     owner
  //   );

  //   const setStats = await FantasyCharacterContract.setStatsManager(
  //     FantasyAttributesManagerContract.address
  //   );

  //   await setStats.wait();

  //   const VerifierFactory = new Verifier__factory(owner);
  //   const VerifierContract = await VerifierFactory.deploy();
  //   await VerifierContract.deployed();

  //   console.log("Verifier Address: ", VerifierContract.address);

  const CastleCampaignFactory = new CastleCampaign__factory(owner);
  const CastleCampaignContract = await CastleCampaignFactory.deploy(
    FantasyCharAddress,
    attributesAddress,
    4,
    verifierAddress
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
