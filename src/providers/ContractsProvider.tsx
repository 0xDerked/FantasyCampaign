import * as React from "react";
import { ReactElement, useEffect } from "react";
import { ethers } from "ethers";
import CastleCampaign from "../../artifacts/contracts/CastleCampaign.sol/CastleCampaign.json";
import { useWallet } from "../hooks/useWallet";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import FantasyAttributesManager from "../../artifacts/contracts/FantasyAttributesManager.sol/FantasyAttributesManager.json";

const castleCampaignAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const fantasyCharacterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const attributesManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export type Contracts = {
  castleCampaignContract: ethers.Contract;
  attributesManagerContract: ethers.Contract;
  fantasyCharacterContract: ethers.Contract;
};

export const ContractsContext = React.createContext<Contracts | null>(null);

export const ContractsProvider: React.FC = ({
  children,
}): ReactElement | null => {
  const [contracts, setContracts] = React.useState<Contracts | null>(null);
  const { signer } = useWallet();
  useEffect(() => {
    if (signer && !contracts) {
      setContracts({
        castleCampaignContract: new ethers.Contract(
          castleCampaignAddress,
          CastleCampaign.abi,
          signer
        ),
        attributesManagerContract: new ethers.Contract(
          attributesManagerAddress,
          FantasyAttributesManager.abi,
          signer
        ),
        fantasyCharacterContract: new ethers.Contract(
          fantasyCharacterAddress,
          FantasyCharacter.abi,
          signer
        ),
      });
    }
  }, [signer]);
  if (!contracts) {
    return null;
  }
  return (
    <ContractsContext.Provider value={contracts}>
      {children}
    </ContractsContext.Provider>
  );
};
