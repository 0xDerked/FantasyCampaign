import * as React from "react";
import { CharacterClass, Routes } from "../types";
import styled from "styled-components";
import { useGetAvailableCharacters } from "../hooks/useGetAvailableCharacters";
import { Button } from "../components/Button";
import { CenterFill } from "../components/Layout";
import { useGameData } from "../hooks/useGameData";
import { useWallet } from "../hooks/useWallet";
import { createCharacter, fetchAllMintedCharacters } from "../api/api";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";

const SelectedCharacterButton = styled.button<{
  selected: boolean;
  exists: boolean;
}>`
  font-size: 10px;
  height: 50px;
  width: 50px;
  margin: 10px;
  border-width: 2px;
  border-style: solid;
  background-color: ${props => (props.exists ? "green" : "black")};
  border-color: ${props => (props.selected ? "dodgerblue" : "transparent")};
  font-family: inherit;
  color: white;
`;

const CharacterContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const CreateCharacterScreen = () => {
  const { data: mintedCharacterData } = useQueryAllMintedCharacters();
  const allCharacters = useGetAvailableCharacters();
  const [gameData, setGameData] = useGameData();
  const { selectedTokenId } = gameData;
  const { signer } = useWallet();
  const [selectedCharacterId, setSelectedCharacterId] = React.useState<
    number | null
  >(null);
  const mintedCharacterIds = Object.keys(mintedCharacterData || {}).map(id =>
    parseInt(id, 10)
  );

  const handleCreateCharacter = async () => {
    try {
      await createCharacter(signer, selectedCharacterId);
      setGameData({
        ...gameData,
        route: Routes.EnterCampaignScreen,
      });
    } catch (e: any) {
      alert(`Error creating character: ${e.message}`);
    } finally {
      //
    }
  };

  const handleUseExistingCharacter = () => {
    setGameData({
      ...gameData,
      selectedTokenId,
      route: Routes.EnterCampaignScreen,
    });
  };

  const handleSelectCharacter = (char: CharacterClass) => {
    setSelectedCharacterId(char);
  };

  return (
    <CenterFill>
      <CharacterContainer>
        {Object.values(allCharacters).map(char => (
          <SelectedCharacterButton
            key={char.name}
            // @TODO make this token id!!!
            selected={selectedCharacterId === char.id}
            onClick={() => handleSelectCharacter(char.id)}
            exists={char.id in mintedCharacterIds}
          >
            {char.name}
          </SelectedCharacterButton>
        ))}
      </CharacterContainer>
      {selectedCharacterId !== null &&
      selectedCharacterId in mintedCharacterIds ? (
        <Button onClick={handleUseExistingCharacter}>
          Use Existing Character
        </Button>
      ) : (
        <Button onClick={handleCreateCharacter}>Create New Character</Button>
      )}
    </CenterFill>
  );
};
