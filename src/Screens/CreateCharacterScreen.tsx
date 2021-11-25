import * as React from "react";
import { CharacterClass, GameModes } from "../types";
import styled from "styled-components";
import { useGetAvailableCharacters } from "../hooks/useGetAvailableCharacters";
import { Button } from "../components/Button";
import { CenterFill } from "../components/Layout";
import { useGameData } from "../hooks/useGameData";
import { useWallet } from "../hooks/useWallet";
import { createCharacter, enterCampaign } from "../api/api";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";
import { StatsTable } from "../components/StatsTable";
import { useContracts } from "../hooks/useContracts";

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
  const { signer } = useWallet();
  const [gameData, setGameData] = useGameData();
  const contracts = useContracts();
  const { data: mintedCharacterData, refetch: refetchMintedCharacterData } =
    useQueryAllMintedCharacters();

  const allCharacters = useGetAvailableCharacters();
  const charactersWithLiveData = allCharacters.map(character => {
    const mintedCharacter = mintedCharacterData?.[character.id];
    return mintedCharacter || character;
  });

  const [selectedCharacterId, setSelectedCharacterId] = React.useState<
    number | null
  >(null);

  const selectedCharacter = charactersWithLiveData?.find(
    character => character.id === selectedCharacterId
  );

  const selectedCharacterTokenId = selectedCharacter?.tokenId;

  const handleCreateCharacter = async () => {
    try {
      await createCharacter({
        signer,
        characterId: selectedCharacterId,
        contracts,
      });
      await refetchMintedCharacterData();
    } catch (e: any) {
      alert(`Error creating character: ${e.data?.message || e.message}`);
    } finally {
      //
    }
  };

  const handleUseExistingCharacter = async () => {
    if (typeof selectedCharacterTokenId === "number") {
      try {
        await enterCampaign({
          signer,
          contracts,
          characterTokenId: selectedCharacterTokenId,
        });
        setGameData({
          ...gameData,
          selectedTokenId: selectedCharacterTokenId,
          mode: GameModes.ExploringMaze,
        });
      } catch (e: any) {
        alert(`Error starting campaign:  ${e.data?.message || e.message}`);
      }
    }
  };

  const handleSelectCharacter = (id: number) => {
    setSelectedCharacterId(id);
  };

  return (
    <CenterFill>
      <CharacterContainer>
        {charactersWithLiveData.map(character => (
          <SelectedCharacterButton
            key={character.id}
            selected={selectedCharacterId === character.id}
            onClick={() => handleSelectCharacter(character.id)}
            exists={typeof character.tokenId === "number"}
          >
            {character.name}
          </SelectedCharacterButton>
        ))}
        {selectedCharacter ? (
          <StatsTable character={selectedCharacter} />
        ) : null}
      </CharacterContainer>
      {typeof selectedCharacterTokenId == "number" ? (
        <Button onClick={handleUseExistingCharacter}>
          Start/Resume Campaign
        </Button>
      ) : (
        <Button onClick={handleCreateCharacter} disabled={!selectedCharacterId}>
          Create New Character
        </Button>
      )}
    </CenterFill>
  );
};
