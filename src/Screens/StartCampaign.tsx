import * as React from "react";
import { Routes } from "../types";
import { useGameData } from "../providers/GameData";
import styled from "styled-components";
import { useWallet } from "../providers/WalletProvider";
import { ethers, BigNumber } from "ethers";
import CastleCampaign from "../../artifacts/contracts/CastleCampaign.sol/CastleCampaign.json";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import { useEffect, useState } from "react";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StartCampaign = () => {
  const { signer } = useWallet();
  const [characters, setCharacters] = useState<any>();
  const [gameData, setGameData] = useGameData();

  useEffect(() => {
    (async () => {
      if (!signer) {
        return;
      }
      try {
        const address = await signer.getAddress();
        const contract = new ethers.Contract(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          FantasyCharacter.abi,
          signer
        );
        const data: BigNumber[] = await contract.getAllCharacters(address);
        const charData = data.map(id => ethers.utils.formatUnits(id, "wei"));
        setCharacters(charData);
      } catch (e: any) {
        alert(`Failed to get characters: ${e.message}`);
      }
    })();
  }, [signer]);

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
      const tokenId = characters[0]; //just taking the first character we own for now
      const data = await contract.enterCampaign(tokenId);
      setGameData({
        ...gameData,
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
      <button onClick={submit}>Start campaign</button>
      {JSON.stringify(characters)}
    </Container>
  );
};
