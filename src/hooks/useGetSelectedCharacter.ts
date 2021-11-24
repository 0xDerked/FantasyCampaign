import { useGameData } from "./useGameData";
import { CharacterAttributes } from "../types";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";

export const useGetSelectedCharacter = (): null | CharacterAttributes => {
  const [gameData] = useGameData();
  const { data: mintedCharacters } = useQueryAllMintedCharacters();
  const { selectedTokenId } = gameData;
  if (typeof selectedTokenId == "number" && mintedCharacters) {
    for (let [, mintedCharacter] of Object.entries(mintedCharacters)) {
      if (mintedCharacter.tokenId === selectedTokenId) {
        return mintedCharacter;
      }
    }
  }
  return null;
};
