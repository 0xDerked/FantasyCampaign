import * as React from "react";
import { CharacterClass, GameModes } from "../types";
import styled from "styled-components";
import { useGetAvailableCharacters } from "../hooks/useGetAvailableCharacters";
import { ButtonLarge, ButtonSecondary } from "../components/Button";
import {
  AbsoluteCenterFill,
  AbsoluteFill,
  CenterFill,
} from "../components/Layout";
import { useGameData } from "../hooks/useGameData";
import { useWallet } from "../hooks/useWallet";
import { createCharacter, enterCampaign } from "../api/api";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";
import { StatsTable } from "../components/StatsTable";
import { useContracts } from "../hooks/useContracts";
import { GameViewPort } from "../Maze/EnvironmentTextures";
import { CharacterAssets } from "../constants";
import bgSelect from "../assets/scaled/bg_select.png";
import bgBattle from "../assets/scaled/battle_background.png";

const SelectedCharacterButton = styled.button<{
  selected: boolean;
  exists: boolean;
}>`
  appearance: none;
  padding: 0;
  outline: 0;
  background-color: transparent;
  border: none;
  width: 48px;
  margin: 3px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CharacterIcon = styled.img`
  width: 100%;
  image-rendering: pixelated;
`;

const CharacterIconLarge = styled.img`
  width: 45px;
  image-rendering: pixelated;
`;

const CharacterContainer = styled.div`
  display: flex;
  padding-top: 30px;
`;

const Background = styled.img`
  position: absolute;
  top: 0;
  left: 0;
`;

const PreviewContainer = styled.div`
  position: absolute;
  top: 4px;
  left: 5px;
`;

const StatsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const CreateButtonContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

const BackButtonContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

const Prompt = styled.div`
  font-size: 13px;
  width: 100%;
  position: absolute;
  top: 10px;
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

  if (typeof selectedCharacterId === "number" && selectedCharacter) {
    return (
      <GameViewPort>
        <Background src={bgBattle} style={{ opacity: 0.3 }} />
        <PreviewContainer>
          <CharacterIconLarge
            src={CharacterAssets[selectedCharacterId]!.front}
          />
        </PreviewContainer>
        <StatsContainer>
          <StatsTable character={selectedCharacter} />
        </StatsContainer>
        <BackButtonContainer>
          <ButtonSecondary onClick={() => setSelectedCharacterId(null)}>
            ← Back
          </ButtonSecondary>
        </BackButtonContainer>
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
      </GameViewPort>
    );
  }

  return (
    <GameViewPort>
      <Background src={bgSelect} />
      <AbsoluteFill>
        <Prompt>Choose Your Adventurer!</Prompt>
        <CharacterContainer>
          {charactersWithLiveData.map(({ id, tokenId }) => (
            <SelectedCharacterButton
              key={id}
              selected={selectedCharacterId === id}
              onClick={() => handleSelectCharacter(id)}
              exists={typeof tokenId === "number"}
            >
              <CharacterIcon src={CharacterAssets[id]!.front} />
            </SelectedCharacterButton>
          ))}
        </CharacterContainer>
      </AbsoluteFill>
    </GameViewPort>
  );
};
