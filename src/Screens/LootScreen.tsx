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
import { Image } from "../components/Image";
import lance from "../assets/scaled/lance.png";

const LootItem = styled(Image)`
  margin-bottom: 10px;
  width: 10px;
`;

const Title = styled.div`
  font-size: 9px;
  margin-bottom: 7px;
  margin-top: 0;
  padding: 0;
  text-align: center;
`;

const Container = styled(AbsoluteCenterFill)`
  padding: 17px;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: 1px solid #81603e;
  box-shadow: 0 0 0 1px #a18160;
`;

export const LootScreen = () => {
  const { data: lootItem } = useQueryLootStats();
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
      <Title>You found the {lootItem?.name}</Title>
      <LootItem src={lance} />
      <ButtonAttack onClick={handleEndLooting}>Take Loot</ButtonAttack>
    </Container>
  );
};
