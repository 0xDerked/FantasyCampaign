import * as React from "react";

import { GameModes } from "../types";
import { ButtonText } from "../components/Button";
import { useGameData } from "../hooks/useGameData";
import { AbsoluteCenterFill, AbsoluteFill } from "../components/Layout";
import styled from "styled-components";

import bgBattle from "../assets/scaled/battle_background.png";
import { Image } from "../components/Image";

const Background = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
`;

const Title = styled.div``;

export const SplashScreen = () => {
  const [_, setGameData] = useGameData();
  const connect = () => {
    setGameData(gameData => ({
      ...gameData,
      mode: GameModes.SelectingCharacter,
    }));
  };
  return (
    <AbsoluteFill>
      <Background src={bgBattle} style={{ opacity: 0.3 }} />
      <AbsoluteCenterFill>
        <Title>Fantasy Campaign</Title>
        <ButtonText onClick={connect}>~ Press Start ~</ButtonText>
      </AbsoluteCenterFill>
    </AbsoluteFill>
  );
};
