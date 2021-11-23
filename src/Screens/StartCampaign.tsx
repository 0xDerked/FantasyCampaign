import * as React from "react";
import { Routes } from "../types";
import { useGameData } from "../providers/GameData";
import styled from "styled-components";
import { useWallet } from "../providers/WalletProvider";
import { ethers } from "ethers";
import CastleCampaign from "../../artifacts/contracts/CastleCampaign.sol/CastleCampaign.json";
import { useGetSelectedCharacter } from "../hooks/useGetSelectedCharacter";
import { Button } from "../components/Button";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StartCampaign = () => {
  const { signer } = useWallet();
  const selectedCharacter = useGetSelectedCharacter();
  const [gameData, setGameData] = useGameData();

  const startCampaign = async () => {
    if (!signer) {
      return;
    }
    try {
      const contract = new ethers.Contract(
        "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
        CastleCampaign.abi,
        signer
      );
      const tokenId = selectedCharacter?.id;
      await contract.enterCampaign(tokenId);
      setGameData({
        ...gameData,
        route: Routes.Maze,
      });
    } catch (e: any) {
      const rpcErrorMessage: string = e?.data?.message;
      if (rpcErrorMessage?.match(/Campaign Previously Started/)) {
        // It's fine: session's started so we can just resume
        setGameData({
          ...gameData,
          route: Routes.Maze,
        });
      } else {
        alert(`Error starting campaign: ${e.message}`);
      }
    } finally {
      //
    }
  };
  return (
    <Container>
      {selectedCharacter?.name}
      <Button onClick={startCampaign}>Start/Resume campaign</Button>
    </Container>
  );
};
