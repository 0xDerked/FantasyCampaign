import * as React from "react";
import { CharacterClass } from "../types";
import { useGameData } from "../providers/GameData";
import styled from "styled-components";
import { characterStats } from "../constants";

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
  const [characterClass, setCharacterClass] =
    React.useState<CharacterClass | null>(null);

  const submit = () => {
    setGameData({
      ...gameData,
      characterClass,
    });
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
