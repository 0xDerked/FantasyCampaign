import * as React from "react";

import { useWallet } from "../providers/WalletProvider";

export const SplashScreen = () => {
  const { connectWallet } = useWallet();
  return (
    <div>
      <h1>Fantasy Campaign</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
};
