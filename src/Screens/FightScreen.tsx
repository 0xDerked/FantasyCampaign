import * as React from "react";
import styled from "styled-components";
import { Image } from "../components/Image";
import { ButtonAttack } from "../components/Button";
import { attackWithAbility, attackWithItem, getTurnData } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";
import { useQueryMobStats } from "../api/useQueryMobStats";
import { useGameData } from "../hooks/useGameData";
import { useEffect } from "react";
import { useQueryPlayerStats } from "../api/useQueryPlayerStats";
import { GameModes } from "../types";
import { CharacterAssets } from "../constants";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";
import { AbsoluteFill } from "../components/Layout";
import battleBackground from "../assets/scaled/battle_background.png";
import henchman from "../assets/scaled/henchman.png";
import dragonBackground from "../assets/scaled/dragon_stage.png";
import dragon from "../assets/scaled/dragon.png";
import { useQueryLootStats } from "../api/useQueryLootStats";

const Background = styled(Image).attrs(() => ({
  src: battleBackground,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const DragonBackground = styled(Image).attrs(() => ({
  src: dragonBackground,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Avatar = styled(Image)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Henchman = styled(Image).attrs(() => ({
  src: henchman,
}))`
  position: absolute;
  top: 17px;
  right: 27px;
`;

const Dragon = styled(Image).attrs(() => ({
  src: dragon,
}))`
  position: absolute;
  top: 1px;
  right: 2px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MobStatContainer = styled.div`
  position: absolute;
  left: 5px;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobStat = styled.div`
  font-size: 8px;
  padding: 2px 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2417;
  border: 1px solid #5f462b;
  box-shadow: 0 0 0 1px #2b2417;
`;

const PlayerStat = styled.div`
  position: absolute;
  left: 5px;
  bottom: 5px;
  right: 5px;
  font-size: 8px;
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2b2417;
  border: 1px solid #5f462b;
  box-shadow: 0 0 0 1px #2b2417;
`;

const Divider = styled.div`
  width: 1px;
  border-right: 1px solid #5f462b;
  margin-left: 4px;
  margin-right: 4px;
  align-self: stretch;
`;

const Padding = styled.div`
  width: 1px;
  margin-left: 2px;
  margin-right: 2px;
  align-self: stretch;
`;

export const FightScreen = () => {
  const { data: playerData } = useQueryPlayerStats();
  const { signer } = useWallet();
  const contracts = useContracts();
  const [gameData, setGameData] = useGameData();
  const { selectedTokenId, isRollingDice } = gameData;
  const { data: mobStats } = useQueryMobStats();
  const { data: lootData } = useQueryLootStats();
  const message = gameData?.message;
  const tokenId = gameData?.selectedTokenId;
  const isDragon = mobStats?.[0]?.name === "Draco";
  const lootItem = lootData?.[0];
  const canShowLance = lootItem?.numUses === 0; // Hard code to only allow lance to be used once

  const { data: mintedCharacterData, refetch: refetchMintedCharacterData } =
    useQueryAllMintedCharacters();
  const selectedCharacterId = Object.entries(mintedCharacterData || {}).find(
    ([_, character]) => character.tokenId === selectedTokenId
  )?.[1].id;

  const avatarImg = CharacterAssets[selectedCharacterId || -1]?.back;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    if (message) {
      timeout = setTimeout(() => {
        setGameData({ ...gameData, message: null });
      }, 1000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [gameData, message, setGameData]);

  const handleAttackWithAbility = async (abilityIndex: number) => {
    if (typeof tokenId === "number" && signer && contracts) {
      try {
        const turnType = await getTurnData({
          signer,
          contracts,
          characterTokenId: tokenId,
        });
        if (turnType === 0) {
          setGameData({
            ...gameData,
            mode: GameModes.ExploringMaze,
          });
        } else {
          setGameData({
            ...gameData,
            isRollingDice: true,
          });
          await attackWithAbility({
            abilityIndex,
            characterTokenId: tokenId,
            contracts,
            signer,
            target: 0, // Only one mob member currently
          });
        }
      } catch (e: any) {
        alert(`Something went wrong attacking ${e.data?.message || e.message}`);
      }
    }
  };

  const handleAttackWithItem = async (itemIndex: number) => {
    if (typeof tokenId === "number" && signer && contracts) {
      try {
        const turnType = await getTurnData({
          signer,
          contracts,
          characterTokenId: tokenId,
        });
        if (turnType === 0) {
          setGameData({
            ...gameData,
            mode: GameModes.ExploringMaze,
          });
        } else {
          setGameData({
            ...gameData,
            isRollingDice: true,
          });
          await attackWithItem({
            itemIndex: itemIndex,
            characterTokenId: tokenId,
            contracts,
            signer,
            target: 0, // Only one mob member currently
          });
        }
      } catch (e: any) {
        alert(`Something went wrong attacking ${e.data?.message || e.message}`);
      } finally {
        //
      }
    }
  };

  return (
    <AbsoluteFill>
      {isDragon ? <DragonBackground /> : <Background />}
      {isDragon ? <Dragon /> : <Henchman />}
      {avatarImg ? <Avatar src={avatarImg} /> : null}

      <MobStatContainer>
        <MobStat>
          Health&ensp;
          {mobStats?.[0]?.health}
          <Divider />
          Strength&ensp;{mobStats?.[0]?.strength}
        </MobStat>
      </MobStatContainer>
      <PlayerStat>
        <div>Health&ensp;{playerData?.health}</div>
        <ButtonsContainer>
          {canShowLance ? (
            <ButtonAttack
              onClick={() => handleAttackWithItem(0)} // Hard-coded to Lance for now
              disabled={isRollingDice}
            >
              Use Lance
            </ButtonAttack>
          ) : null}
          <Padding />

          {playerData?.abilities.map((ability, index) => {
            return (
              <React.Fragment key={ability.name}>
                <Padding />
                <ButtonAttack
                  onClick={() => handleAttackWithAbility(index)}
                  disabled={isRollingDice}
                >
                  {ability.name}
                </ButtonAttack>
              </React.Fragment>
            );
          })}
        </ButtonsContainer>
      </PlayerStat>
    </AbsoluteFill>
  );
};
