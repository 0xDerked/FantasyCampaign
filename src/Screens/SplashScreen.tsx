import * as React from "react";

import { GameModes } from "../types";
import { ButtonLarge } from "../components/Button";
import { CenterFill } from "../components/Layout";
import { useGameData } from "../hooks/useGameData";

export const SplashScreen = () => {
  const [_, setGameData] = useGameData();
  const connect = () => {
    setGameData(gameData => ({
      ...gameData,
      mode: GameModes.SelectingCharacter,
    }));
  };
  return (
    <CenterFill>
      <h1>Fantasy Campaign</h1>
      <ButtonLarge onClick={connect}>Connect Wallet</ButtonLarge>
    </CenterFill>
  );
};
