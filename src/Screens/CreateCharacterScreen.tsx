import * as React from "react";
import { CharacterClass, Routes } from "../types";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import { useGetMintedCharacters } from "../hooks/useGetMintedCharacters";
import { useGetAvailableCharacters } from "../hooks/useGetAvailableCharacters";
import { Button } from "../components/Button";
import { CenterFill } from "../components/Layout";
import { useGameData } from "../hooks/useGameData";
import { useWallet } from "../hooks/useWallet";

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
  const [gameData, setGameData] = useGameData();
  const playerCharacters = useGetMintedCharacters();
  const allCharacters = useGetAvailableCharacters();
  const { signer } = useWallet();
  const [selectedCharacterId, setSelectedCharacterId] = React.useState<
    number | null
  >(null);

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
      const address = await signer.getAddress();
      const data: BigNumber[] = await contract.getAllCharacters(address);
      const tokenIds = data.map(id => id.toNumber());
      const promises = tokenIds.map(id => contract.getCharacter(id));

      setGameData({
        ...gameData,
        mintedCharacters: {
          ...gameData.mintedCharacters,
          [tokenId]: theDataWeJustGotBack,
        },
        route: Routes.StartCampaignScreen,
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
      route: Routes.StartCampaignScreen,
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
        <Button onClick={handleCreateCharacter}>Create New Character</Button>
      )}
    </CenterFill>
  );
};
