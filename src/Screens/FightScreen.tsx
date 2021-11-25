import * as React from "react";
import styled from "styled-components";
import match from "../assets/scaled/match.png";
import { scale as scaleDims } from "../utils/scale";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";
import { Image } from "../components/Image";
import { useGetSelectedCharacter } from "../hooks/useGetSelectedCharacter";
import { ButtonAttack } from "../components/Button";
import { CharacterAbilities } from "../types";
import { attackWithAbility } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";

const FightScreenMock = styled(Image).attrs(() => ({
  src: match,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${scaleDims(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scaleDims(UNSCALED_VIEWPORT_WIDTH)}px;
`;

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${scaleDims(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scaleDims(UNSCALED_VIEWPORT_WIDTH)}px;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  right: ${scaleDims(20)}px;
  bottom: ${scaleDims(20)}px;
`;

export const FightScreen = () => {
  const character = useGetSelectedCharacter();
  const { signer } = useWallet();
  const contracts = useContracts();

  const handleAttack = async (abilityIndex: number) => {
    if (typeof character?.tokenId === "number" && signer && contracts) {
      try {
        await attackWithAbility({
          abilityIndex,
          characterTokenId: character.tokenId,
          contracts,
          signer,
          target: 0, // Only one mob member currently
        });
      } catch (e: any) {
        alert(`Something went wrong attacking ${e.message}`);
      }
    }
  };

  return (
    <Container>
      <FightScreenMock />
      <ButtonsContainer>
        {character?.abilities.map((ability, index) => {
          return (
            <ButtonAttack
              onClick={() => handleAttack(index)}
              key={ability.name}
            >
              {ability.name}
            </ButtonAttack>
          );
        })}
      </ButtonsContainer>
    </Container>
  );
};
