import * as React from "react";

import { Routes } from "../types";
import { Button } from "../components/Button";
import { CenterFill } from "../components/Layout";
import { useWallet } from "../hooks/useWallet";
import { useGameData } from "../hooks/useGameData";

export const SplashScreen = () => {
  const { connectWallet } = useWallet();
  const [_, setGameData] = useGameData();
  const connect = async () => {
    try {
      await connectWallet();
      setGameData(gameData => ({
        ...gameData,
        route: Routes.CreateCharacterScreen,
      }));
    } catch (e: any) {
      alert(`Something went wrong connecting wallet: ${e.message}`);
    }
  };
  return (
    <CenterFill>
      <h1>Fantasy Campaign</h1>
      <Button onClick={connect}>Connect Wallet</Button>
    </CenterFill>
  );
};
