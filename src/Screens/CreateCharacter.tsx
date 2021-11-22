import * as React from "react";
import { CharacterClass, Routes } from "../types";
import { useGameData } from "../providers/GameData";
import styled from "styled-components";
import { characterStats } from "../constants";
import { useWallet } from "../providers/WalletProvider";
import { ethers } from "ethers";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";

const Button = styled.button<{ selected: boolean }>`
  font-size: 10px;
  font-family: PixeBoy;
  height: 50px;
  width: 50px;
  margin: 10px;
  border-width: 2px;
  border-style: solid;
  background-color: dodgerblue;
  border-color: ${props => (props.selected ? "white" : "dodgerblue")};
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CharacterContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CreateCharacter = () => {
  const [gameData, setGameData] = useGameData();
  const { signer } = useWallet();
  const [characterClass, setCharacterClass] =
    React.useState<CharacterClass | null>(null);

  const submit = async () => {
    if (!signer) {
      return;
    }
    try {
      const contract = new ethers.Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        FantasyCharacter.abi,
        signer
      );
      const transaction = await contract.createCharacter(characterClass);
      await transaction.wait();

      setGameData({
        ...gameData,
        characterClass,
        route: Routes.StartCampaign,
      });
    } catch (e: any) {
      alert(`Error creating character: ${e.message}`);
    } finally {
      //
    }
  };
  const selectCharacter = (char: CharacterClass) => {
    setCharacterClass(char);
  };

  return (
    <Container>
      <CharacterContainer>
        {[
          CharacterClass.Shaman,
          CharacterClass.Warlord,
          CharacterClass.Knight,
          CharacterClass.Wizard,
        ].map(char => (
          <Button
            key={char}
            selected={characterClass === char}
            onClick={() => selectCharacter(char)}
          >
            {characterStats[char]?.name}
          </Button>
        ))}
      </CharacterContainer>
      <button onClick={submit} disabled={characterClass === null}>
        Create Character
      </button>
    </Container>
  );
};
