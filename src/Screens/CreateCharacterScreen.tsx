import * as React from "react";
import { GameModes } from "../types";
import styled from "styled-components";
import { useGetAvailableCharacters } from "../hooks/useGetAvailableCharacters";
import { ButtonLarge } from "../components/Button";
import { AbsoluteFill } from "../components/Layout";
import { useGameData } from "../hooks/useGameData";
import { useWallet } from "../hooks/useWallet";
import { createCharacter, enterCampaign } from "../api/api";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";
import { useContracts } from "../hooks/useContracts";
import { GameViewPort } from "../Maze/EnvironmentTextures";
import { CharacterAssets } from "../constants";
import bgSelect from "../assets/scaled/bg_select.png";
import { Image } from "../components/Image";

const SelectedCharacterButton = styled.button<{
  selected: boolean;
  exists: boolean;
}>`
  appearance: none;
  padding: 0;
  outline: 0;
  background-color: transparent;
  border: none;
  width: 37px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  font-family: inherit;
  transform: scale(${props => (props.selected ? 1.1 : 1)});
`;

const Label = styled.div`
  color: lightgray;
  font-size: 7px;
  text-align: center;
  margin-top: 3px;
  background-color: black;
  padding: 0 2px;
`;

const CharacterIcon = styled(Image)`
  width: 100%;
`;

const CharacterContainer = styled.div`
  display: flex;
  padding-top: 24px;
  justify-content: center;
`;

const Background = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
`;

const CreateButtonContainer = styled.div`
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

const Prompt = styled.div`
  font-size: 11px;
  width: 100%;
  position: absolute;
  top: 8px;
  left: 0;
  display: flex;
  justify-content: center;
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
        alert(`Error starting campaign: ${e.data?.message || e.message}`);
      }
    }
  };

  const handleSelectCharacter = (id: number) => {
    setSelectedCharacterId(id);
  };

  return (
    <GameViewPort>
      <Background src={bgSelect} />
      <AbsoluteFill>
        <Prompt>Choose Your Adventurer!</Prompt>
        <CharacterContainer>
          {charactersWithLiveData.map(({ id, tokenId, name }) => (
            <SelectedCharacterButton
              key={id}
              selected={selectedCharacterId === id}
              onClick={() => handleSelectCharacter(id)}
              exists={typeof tokenId === "number"}
            >
              <CharacterIcon src={CharacterAssets[id]!.front} />
              <Label>{name}</Label>
            </SelectedCharacterButton>
          ))}
        </CharacterContainer>
        <CreateButtonContainer>
          {typeof selectedCharacterTokenId == "number" ? (
            <ButtonLarge onClick={handleUseExistingCharacter}>
              Start/Resume Campaign
            </ButtonLarge>
          ) : (
            <ButtonLarge
              onClick={handleCreateCharacter}
              disabled={!selectedCharacterId}
            >
              Create New Character
            </ButtonLarge>
          )}
        </CreateButtonContainer>
      </AbsoluteFill>
    </GameViewPort>
  );
};
