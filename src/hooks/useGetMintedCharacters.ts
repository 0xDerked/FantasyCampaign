import { useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import { useWallet } from "./useWallet";
import { CharacterAttributes } from "../types";
import { useGameData } from "./useGameData";

export const useGetMintedCharacters = (): Record<
  string,
  CharacterAttributes
> | null => {
  const [gameData, setGameData] = useGameData();
  const { signer } = useWallet();

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
        // Get all data
        const charTokenIds = data.map(id => id.toNumber());
        const promised = charTokenIds.map(id =>
          contract.getCharacter(id, address)
        );
        // Fetch the turn number for the token id
        // Congrats! Now find the exit
        setGameData({
          ...gameData,
          mintedCharacters: {
            ...gameData.mintedCharacters,
            [tokenId]: theDataWeJustGotBack,
            [tokenId]: theDataWeJustGotBack,
            [tokenId]: theDataWeJustGotBack,
            [tokenId]: theDataWeJustGotBack,
          },
        });
      } catch (e: any) {
        alert(`Failed to get characters: ${e.message}`);
      }
    })();
  }, [signer]);
  return gameData.mintedCharacters;
};
