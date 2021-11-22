import * as React from "react";

import { useWallet } from "../providers/WalletProvider";
import { useGameData } from "../providers/GameData";
import { Routes } from "../types";

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
    <div>
      <h1>Fantasy Campaign</h1>
      <button onClick={connect}>Connect Wallet</button>
    </div>
  );
};
