import * as React from "react";
import styled from "styled-components";
import { useGameData } from "../hooks/useGameData";

export const FullScreenModal = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
  background-color: black;
  color: white;
  font-size: 10px;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  border: 1px solid white;
  box-shadow: 0 0 0 1px black;
`;

export const OracleModal = () => {
  const [gameData] = useGameData();
  return gameData.isRollingDice ? (
    <FullScreenModal>
      <span>The dragon consults its oracle to determine your fate!</span>
    </FullScreenModal>
  ) : null;
};
