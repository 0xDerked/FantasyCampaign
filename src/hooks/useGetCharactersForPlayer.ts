import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import { CharacterAttributes, characterStats } from "../constants";
import { useWallet } from "./useWallet";

export const useGetCharactersForPlayer = (): CharacterAttributes[] | null => {
  const { signer } = useWallet();
  const [characterIds, setCharacterIds] = useState<null | number[]>(null);

  useEffect(() => {
    (async () => {
      if (!signer) {
        return;
      }
      try {
        const address = await signer.getAddress();
        const contract = new ethers.Contract(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          FantasyCharacter.abi,
          signer
        );
        const data: BigNumber[] = await contract.getAllCharacters(address);
        const charIDs = data.map(id =>
          parseInt(ethers.utils.formatUnits(id, "wei"), 10)
        );
        setCharacterIds(charIDs);
      } catch (e: any) {
        alert(`Failed to get characters: ${e.message}`);
      }
    })();
  }, [signer]);
  if (characterIds?.length) {
    const stats = [];
    for (let i = 0; i < characterIds.length; i++) {
      const stat = characterStats[characterIds[i]];
      if (stat) {
        stats.push(stat);
      }
    }
    return stats;
  }
  return null;
};
