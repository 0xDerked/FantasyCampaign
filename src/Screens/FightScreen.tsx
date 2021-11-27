import * as React from "react";
import styled from "styled-components";
import { Image } from "../components/Image";
import { ButtonAttack } from "../components/Button";
import { attackWithAbility, getTurnData } from "../api/api";
import { useWallet } from "../hooks/useWallet";
import { useContracts } from "../hooks/useContracts";
import { useQueryMobStats } from "../api/useQueryMobStats";
import { useGameData } from "../hooks/useGameData";
import { useEffect } from "react";
import { useQueryPlayerStats } from "../api/useQueryPlayerStats";
import { GameModes } from "../types";
import { CharacterAssets } from "../constants";
import { useQueryAllMintedCharacters } from "../api/useQueryAllMintedCharacters";
import battleBackground from "../assets/scaled/battle_background.png";
import henchman from "../assets/scaled/henchman.png";
import { AbsoluteFill } from "../components/Layout";

const Background = styled(Image).attrs(() => ({
  src: battleBackground,
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

const ButtonsContainer = styled.div``;

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

export const FightScreen = () => {
  const { data: playerData } = useQueryPlayerStats();
  const { signer } = useWallet();
  const contracts = useContracts();
  const [gameData, setGameData] = useGameData();
  const { selectedTokenId } = gameData;
  const { data: mobStats } = useQueryMobStats();
  const [localMessage, setLocalMessage] = React.useState<string | null>(null);
  const message = gameData?.message;
  const tokenId = gameData?.selectedTokenId;
  console.log(mobStats);

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
        setLocalMessage(null);
      }, 1000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [message]);

  const handleAttack = async (abilityIndex: number) => {
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
            message: "You attack!",
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

  return (
    <AbsoluteFill>
      <Background />
      <Henchman />
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
          {playerData?.abilities.map((ability, index) => {
            return (
              <ButtonAttack
                onClick={() => handleAttack(index)}
                key={ability.name}
              >
                {ability.name}
              </ButtonAttack>
            );
          })}
        </ButtonsContainer>
      </PlayerStat>
    </AbsoluteFill>
  );
};
