import * as React from "react";
import { Routes } from "../types";
import styled from "styled-components";
import { ethers } from "ethers";
import CastleCampaign from "../../artifacts/contracts/CastleCampaign.sol/CastleCampaign.json";
import { useGetSelectedCharacter } from "../hooks/useGetSelectedCharacter";
import { Button } from "../components/Button";
import { useGetMintedCharacters } from "../hooks/useGetMintedCharacters";
import { useGameData } from "../hooks/useGameData";
import { useWallet } from "../hooks/useWallet";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StartCampaignScreen = () => {
  const { signer } = useWallet();
  const selectedCharacter = useGetSelectedCharacter();
  const [gameData, setGameData] = useGameData();
  console.log(222, selectedCharacter);
  useGetMintedCharacters();

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
      const turn = await contract.playerTurn(tokenId);
      const turnNumber = turn.toNumber();
      if (turnNumber === 0) {
        await contract.enterCampaign(tokenId);
      }
      setGameData({
        ...gameData,
        route: Routes.MazeScreen,
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
      <Button onClick={startCampaign}>Start/Resume campaign</Button>
    </Container>
  );
};
