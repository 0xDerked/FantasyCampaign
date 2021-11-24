import { CharacterAttributes } from "../constants";
import { useGetAvailableCharacters } from "./useGetAvailableCharacters";
import { useGameData } from "./useGameData";

export const useGetSelectedCharacter = (): null | CharacterAttributes => {
  const [gameData] = useGameData();
  const allCharacters = useGetAvailableCharacters();
  const { selectedCharacterId } = gameData;
  const selectedCharacter = allCharacters.find(
    character => character.id === selectedCharacterId
  );
  if (selectedCharacter) {
    return selectedCharacter;
  }
  return null;
};
