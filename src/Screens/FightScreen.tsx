import * as React from "react";
import styled from "styled-components";
import match from "../assets/scaled/match.png";
import { scale } from "../utils/scale";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";
import { Image } from "../components/Image";
import { useGetSelectedCharacter } from "../hooks/useGetSelectedCharacter";
import { ButtonAttack } from "../components/Button";
import { attackWithAbility } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";
import { useQueryMobStats } from "../api/useQueryMobStats";

const FightScreenMock = styled(Image).attrs(() => ({
  src: match,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${scale(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
`;

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${scale(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  right: ${scale(20)}px;
  bottom: ${scale(20)}px;
`;

const MobStat = styled.div`
  position: absolute;
  right: ${scale(UNSCALED_VIEWPORT_WIDTH / 3)}px;
  left: ${scale(UNSCALED_VIEWPORT_WIDTH / 3)}px;
  top: ${scale(0)}px;
  height: ${scale(40)}px;
  font-size: ${scale(28)}px;
  background-color: black;
  border: ${scale(3)}px double red;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FightScreen = () => {
  const character = useGetSelectedCharacter();
  const { signer } = useWallet();
  const contracts = useContracts();
  const { data: mobStats } = useQueryMobStats();

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
      <MobStat>{mobStats?.[0]?.health}</MobStat>
    </Container>
  );
};
