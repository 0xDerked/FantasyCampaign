import * as React from "react";

import { Routes } from "../types";
import { Button } from "../components/Button";
import { CenterFill } from "../components/Layout";
import { useGameData } from "../hooks/useGameData";

export const SplashScreen = () => {
  const [_, setGameData] = useGameData();
  const connect = () => {
    setGameData(gameData => ({
      ...gameData,
      route: Routes.CreateCharacterScreen,
    }));
  };
  return (
    <CenterFill>
      <h1>Fantasy Campaign</h1>
      <Button onClick={connect}>Connect Wallet</Button>
    </CenterFill>
  );
};
