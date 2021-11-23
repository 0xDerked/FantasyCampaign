import * as React from "react";
import { Routes, GameMode } from "../types";
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

  const submit = async () => {
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
      const data = await contract.enterCampaign(tokenId);
      setGameData({
        ...gameData,
        gameMode: GameMode.Navigation,
        route: Routes.Maze,
      });
    } catch (e: any) {
      alert(`Error starting campaign: ${e.message}`);
    } finally {
      //
    }
  };
  return (
    <Container>
      {selectedCharacter?.name}
      <Button onClick={submit}>Start campaign</Button>
    </Container>
  );
};
