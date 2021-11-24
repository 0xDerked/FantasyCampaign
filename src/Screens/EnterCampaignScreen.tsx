import * as React from "react";
import { Routes } from "../types";
import styled from "styled-components";
import { useGetSelectedCharacter } from "../hooks/useGetSelectedCharacter";
import { Button } from "../components/Button";
import { useGameData } from "../hooks/useGameData";
import { useWallet } from "../hooks/useWallet";
import { enterCampaign } from "../api/api";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const EnterCampaignScreen = () => {
  const { signer } = useWallet();
  const selectedCharacter = useGetSelectedCharacter();
  const [gameData, setGameData] = useGameData();

  const enterCampaignMode = async () => {
    if (!signer) {
      return;
    }
    if (typeof selectedCharacter?.tokenId !== "number") {
      return;
    }
    try {
      await enterCampaign(signer, selectedCharacter.tokenId);
      setGameData({
        ...gameData,
        route: Routes.MazeScreen,
      });
    } catch (e: any) {
      alert(`Error starting campaign: ${e.message}`);
    }
  };
  return (
    <Container>
      {selectedCharacter?.name}
      <Button onClick={enterCampaignMode}>Start/Resume campaign</Button>
    </Container>
  );
};
