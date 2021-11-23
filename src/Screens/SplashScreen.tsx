import * as React from "react";

import { useWallet } from "../providers/WalletProvider";
import { useGameData } from "../providers/GameData";
import { Routes } from "../types";
import { Button } from "../components/Button";
import { CenterFill } from "../components/Layout";

export const SplashScreen = () => {
  const { connectWallet } = useWallet();
  const [_, setGameData] = useGameData();
  const connect = async () => {
    try {
      await connectWallet();
      setGameData(gameData => ({ ...gameData, route: Routes.CreateCharacter }));
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
