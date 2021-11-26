import * as React from "react";
import styled from "styled-components";
import { scale } from "../utils/scale";
import {
  UNSCALED_VIEWPORT_HEIGHT,
  UNSCALED_VIEWPORT_WIDTH,
} from "../Maze/constants";
import { useGameData } from "../hooks/useGameData";
import { GameModes } from "../types";
import { ButtonAttack } from "../components/Button";
import { useQueryLootStats } from "../api/useQueryLootStats";
import { endExploreLoot } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${scale(UNSCALED_VIEWPORT_HEIGHT)}px;
  width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  max-height: ${scale(UNSCALED_VIEWPORT_HEIGHT)}px;
  max-width: ${scale(UNSCALED_VIEWPORT_WIDTH)}px;
  background-color: black;
  color: white;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 3px double white;
`;

const Title = styled.h1`
  font-size: ${scale(30)}px;
  margin-bottom: ${scale(20)}px;
  margin-top: 0;
  padding: 0;
`;

export const LootScreen = () => {
  const { data: lootData } = useQueryLootStats();
  const [gameData, setGameData] = useGameData();
  const { signer } = useWallet();
  const contracts = useContracts();
  const tokenId = gameData?.selectedTokenId;

  const handleEndLooting = async () => {
    if (typeof tokenId === "number" && signer && contracts) {
      try {
        await endExploreLoot({
          signer,
          contracts,
          characterTokenId: tokenId,
        });
        setGameData({
          ...gameData,
          isRollingDice: false,
          message: null,
          mode: GameModes.ExploringMaze,
        });
      } catch (e: any) {
        alert(`Something went exploring loot ${e.data?.message || e.message}`);
        setGameData({
          ...gameData,
          mode: GameModes.ExploringMaze,
        });
      }
    }
  };

  return (
    <Container>
      <Title>You find a corpse of a fellow adventurer!</Title>
      <Title>They have the {lootData?.name}</Title>
      <ButtonAttack onClick={handleEndLooting}>Take Loot</ButtonAttack>
    </Container>
  );
};
