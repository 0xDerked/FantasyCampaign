import * as React from "react";
import { CharacterClass, Routes } from "../types";
import { useGameData } from "../providers/GameData";
import styled from "styled-components";
import { useWallet } from "../providers/WalletProvider";
import { ethers } from "ethers";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import { useGetCharactersForPlayer } from "../hooks/useGetCharactersForPlayer";
import { useGetAllCharacters } from "../hooks/useGetAllCharacters";
import { Button } from "../components/Button";
import { CenterFill } from "../components/Layout";

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

export const CreateCharacter = () => {
  const [gameData, setGameData] = useGameData();
  const playerCharacters = useGetCharactersForPlayer();
  const playerCharacterIds =
    playerCharacters?.map(character => character.id) || [];
  const allCharacters = useGetAllCharacters();
  const { signer } = useWallet();
  const [selectedCharacterId, setSelectedCharacterId] =
    React.useState<CharacterClass | null>(null);

  const handleCreateCharacter = async () => {
    if (!signer) {
      return;
    }
    try {
      const contract = new ethers.Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        FantasyCharacter.abi,
        signer
      );
      const transaction = await contract.createCharacter(selectedCharacterId);
      await transaction.wait();

      setGameData({
        ...gameData,
        selectedCharacterId: selectedCharacterId,
        route: Routes.StartCampaign,
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
      selectedCharacterId: selectedCharacterId,
      route: Routes.StartCampaign,
    });
  };

  const handleSelectCharacter = (char: CharacterClass) => {
    setSelectedCharacterId(char);
  };

  return (
    <CenterFill>
      <CharacterContainer>
        {allCharacters.map(char => (
          <SelectedCharacterButton
            key={char.name}
            selected={selectedCharacterId === char.id}
            onClick={() => handleSelectCharacter(char.id)}
            exists={char.id in playerCharacterIds}
          >
            {char.name}
          </SelectedCharacterButton>
        ))}
      </CharacterContainer>
      {selectedCharacterId !== null &&
      selectedCharacterId in playerCharacterIds ? (
        <Button onClick={handleUseExistingCharacter}>
          Use Existing Character
        </Button>
      ) : (
        <Button
          onClick={handleCreateCharacter}
          disabled={selectedCharacterId === null}
        >
          Create New Character
        </Button>
      )}
    </CenterFill>
  );
};
