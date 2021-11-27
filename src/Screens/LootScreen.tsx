import * as React from "react";
import styled from "styled-components";
import { useGameData } from "../hooks/useGameData";
import { GameModes } from "../types";
import { ButtonAttack } from "../components/Button";
import { useQueryLootStats } from "../api/useQueryLootStats";
import { endExploreLoot } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";
import { AbsoluteCenterFill } from "../components/Layout";

const Title = styled.div`
  font-size: 11px;
  margin-bottom: 7px;
  margin-top: 0;
  padding: 0;
  text-align: center;
`;

const Container = styled(AbsoluteCenterFill)`
  padding: 30px;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: 1px solid #81603e;
  box-shadow: 0 0 0 1px #a18160;
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
          message: null,
          // Let the contract figure out the new user state
          // mode: GameModes.ExploringMaze,
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
