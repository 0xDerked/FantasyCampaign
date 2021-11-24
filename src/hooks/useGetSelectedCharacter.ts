import { useGameData } from "./useGameData";
import { CharacterAttributes } from "../types";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";

export const useGetSelectedCharacter = (): null | CharacterAttributes => {
  const [gameData] = useGameData();
  const { data: mintedCharacters } = useQueryAllMintedCharacters();
  const { selectedTokenId } = gameData;
  if (selectedTokenId && mintedCharacters) {
    return mintedCharacters[selectedTokenId];
  }
  return null;
};
