import * as React from "react";
import { CSSProperties, ReactElement } from "react";
import { circuitWalls } from "./mapData";
import styled from "styled-components";
import { useGameData } from "../hooks/useGameData";
import circuitMap from "./circuitMap";

const Td = styled.td`
  border-width: 1px;
  border-style: solid;
  height: 8px;
  width: 8px;
  text-align: center;
`;

const Table = styled.table`
  background-color: red;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
`;

export const CircuitMap = (): ReactElement => {
  const [gameData] = useGameData();
  const position = gameData.position;
  return (
    <Table>
      <tbody>
        {circuitMap.map((row, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {row.map((col, colIndex) => {
                const borders: CSSProperties = {
                  borderTopWidth: circuitWalls[col][0],
                  borderRightWidth: circuitWalls[col][1],
                  borderBottomWidth: circuitWalls[col][2],
                  borderLeftWidth: circuitWalls[col][3],
                };
                const hasDot =
                  position.row === rowIndex && position.col === colIndex;
                return <Td style={borders} key={colIndex} />;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
