import * as React from "react";
import styled from "styled-components";
import match from "../assets/scaled/match.png";
import { scale } from "../utils/scale";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";
import { Image } from "../components/Image";
import { ButtonAttack } from "../components/Button";
import { attackWithAbility } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";
import { useQueryMobStats } from "../api/useQueryMobStats";
import { useGameData } from "../hooks/useGameData";
import { Modal } from "../components/Modal";
import { useEffect } from "react";
import { useQueryPlayerStats } from "../api/useQueryPlayerStats";

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

const PositionBase = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobStat = styled(PositionBase)`
  right: ${scale(UNSCALED_VIEWPORT_WIDTH / 3)}px;
  left: ${scale(UNSCALED_VIEWPORT_WIDTH / 3)}px;
  top: ${scale(0)}px;
  height: ${scale(40)}px;
  font-size: ${scale(28)}px;
  background-color: black;
  border: ${scale(3)}px double red;
`;

const PlayerStat = styled(PositionBase)`
  left: ${scale(10)}px;
  bottom: ${scale(10)}px;
  height: ${scale(60)}px;
  font-size: ${scale(40)}px;
  background-color: black;
  border: ${scale(3)}px double red;
  padding: ${scale(10)}px;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH / 2)}px;
`;

export const FightScreen = () => {
  const { data: playerData } = useQueryPlayerStats();
  const { signer } = useWallet();
  const contracts = useContracts();
  const [gameData, setGameData] = useGameData();
  const { data: mobStats } = useQueryMobStats();
  const [localMessage, setLocalMessage] = React.useState<string | null>(null);
  const message = gameData?.message;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    if (message) {
      timeout = setTimeout(() => {
        setGameData({ ...gameData, message: null });
        setLocalMessage(null);
      }, 1000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [message]);

  const handleAttack = async (abilityIndex: number) => {
    if (typeof playerData?.tokenId === "number" && signer && contracts) {
      try {
        setGameData({ ...gameData, message: "You attack!" });
        await attackWithAbility({
          abilityIndex,
          characterTokenId: playerData.tokenId,
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
        {playerData?.abilities.map((ability, index) => {
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
      <PlayerStat>{playerData?.health}</PlayerStat>
    </Container>
  );
};
