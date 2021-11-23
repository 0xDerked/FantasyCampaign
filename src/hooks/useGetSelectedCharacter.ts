import { CharacterAttributes } from "../constants";
import { useGetAllCharacters } from "./useGetAllCharacters";
import { useGameData } from "../providers/GameData";

export const useGetSelectedCharacter = (): null | CharacterAttributes => {
  const [gameData] = useGameData();
  const allCharacters = useGetAllCharacters();
  const { selectedCharacterId } = gameData;
  const selectedCharacter = allCharacters.find(
    character => character.id === selectedCharacterId
  );
  if (selectedCharacter) {
    return selectedCharacter;
  }
  return null;
};
