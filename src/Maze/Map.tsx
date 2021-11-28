import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { rotate } from "../utils/rotate";
import { doorsCoords, MAZE_WIDTH, wallCoords } from "./mapData";
import { useGameData } from "../hooks/useGameData";
import { usePosition } from "../hooks/usePosition";
import { DEBUG_MODE } from "../constants";

const CELL_PX = 5;

const Container = styled.div`
  height: ${CELL_PX * MAZE_WIDTH}px;
  width: ${CELL_PX * MAZE_WIDTH}px;
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 500;
  background-color: #382b1f;
  border: 2px solid #382b1f;
`;

const Avatar = styled.div`
  height: ${CELL_PX}px;
  width: ${CELL_PX}px;
  position: absolute;
  font-size: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpawnPoint = styled.div`
  height: ${CELL_PX}px;
  width: ${CELL_PX}px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpawnDot = styled.div`
  height: 2px;
  width: 2px;
  border-radius: 2px;
  background-color: green;
`;

export const Map = ({ rotateMap }: { rotateMap: boolean }): ReactElement => {
  const [gameData] = useGameData();
  const { isGateOpen, moves, spawnPoints } = gameData;
  const position = usePosition();
  const { row, col, dir } = position;
  const By = rotateMap ? 90 * dir : 0;
  const Cx = col;
  const Cy = row;
  const OFFSET = rotateMap ? 2 : 0;
  const rotatedWallCoords = wallCoords.map(({ x1, x2, y1, y2, type }) => {
    const [x1p, y1p] = rotate(x1, y1, Cx, Cy, By);
    const [x2p, y2p] = rotate(x2, y2, Cx, Cy, By);
    return {
      x1: x1p - (rotateMap ? col : 0),
      y1: y1p - (rotateMap ? row : 0),
      x2: x2p - (rotateMap ? col : 0),
      y2: y2p - (rotateMap ? row : 0),
      type,
    };
  });

  const rotatedDoorCoords = doorsCoords.map(({ x1, x2, y1, y2 }) => {
    const [x1p, y1p] = rotate(x1, y1, Cx, Cy, By);
    const [x2p, y2p] = rotate(x2, y2, Cx, Cy, By);
    return {
      x1: x1p - (rotateMap ? col : 0),
      y1: y1p - (rotateMap ? row : 0),
      x2: x2p - (rotateMap ? col : 0),
      y2: y2p - (rotateMap ? row : 0),
    };
  });
  return (
    <Container>
      <svg
        viewBox={`0 0 ${MAZE_WIDTH * CELL_PX} ${MAZE_WIDTH * CELL_PX}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {rotatedWallCoords.map(({ x1, y1, x2, y2 }, i) => (
          <line
            key={JSON.stringify({ x1, y1, x2, y2, i })}
            x1={(x1 + OFFSET) * CELL_PX}
            y1={(y1 + OFFSET) * CELL_PX}
            x2={(x2 + OFFSET) * CELL_PX}
            y2={(y2 + OFFSET) * CELL_PX}
            stroke={"#DCAB7C"}
            strokeWidth={1}
            strokeLinecap={"square"}
          />
        ))}
        {rotatedDoorCoords.map(({ x1, y1, x2, y2 }, i) => (
          <line
            key={JSON.stringify({ x1, y1, x2, y2, i })}
            x1={(x1 + OFFSET) * CELL_PX}
            y1={(y1 + OFFSET) * CELL_PX}
            x2={(x2 + OFFSET) * CELL_PX}
            y2={(y2 + OFFSET) * CELL_PX}
            stroke={isGateOpen ? "black" : "#7E7E7E"}
            strokeWidth={1}
            strokeLinecap={"square"}
          />
        ))}
      </svg>
      <Avatar
        style={{
          left: rotateMap ? OFFSET * CELL_PX : col * CELL_PX,
          top: rotateMap ? OFFSET * CELL_PX : row * CELL_PX,
          transform: `rotate(${rotateMap ? 0 : dir * 90}deg)`,
        }}
      >
        ️️️️↑
      </Avatar>
      {spawnPoints
        .filter(({ isUsed }) => !isUsed)
        .map(({ x, y }) => (
          <SpawnPoint
            key={JSON.stringify({ x, y })}
            style={{
              left: x * CELL_PX,
              top: y * CELL_PX,
            }}
          >
            <SpawnDot />
          </SpawnPoint>
        ))}
      {DEBUG_MODE
        ? moves.map(({ row, col }, index) => (
            <Avatar
              key={index}
              style={{
                left: rotateMap ? OFFSET * CELL_PX : col * CELL_PX,
                top: rotateMap ? OFFSET * CELL_PX : row * CELL_PX,
              }}
            >
              ️️️️.
            </Avatar>
          ))
        : null}
    </Container>
  );
};
