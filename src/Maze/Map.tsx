import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { rotate } from "../utils/rotate";
import { useGameData } from "../providers/GameData";
import { monstersCoords } from "./mapData";

const CELL_PX = 50;

const Container = styled.div`
  position: relative;
  height: ${CELL_PX * 5}px;
  width: ${CELL_PX * 5}px;
  background-color: white;
  overflow: visible;
`;

const Avatar = styled.text`
  font-size: 30px;
  height: ${CELL_PX}px;
  width: ${CELL_PX}px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Map = ({ rotateMap }: { rotateMap: boolean }): ReactElement => {
  const [gameData] = useGameData();
  const { row, col, dir } = gameData.position;
  const By = rotateMap ? 90 * dir : 0;
  const Cx = col;
  const Cy = row;
  const OFFSET = rotateMap ? 2 : 0;
  const rotatedWallCoords = gameData.walls.map(({ x1, x2, y1, y2, type }) => {
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
  const rotatedDoorCoords = gameData.doors.map(({ x1, x2, y1, y2, open }) => {
    const [x1p, y1p] = rotate(x1, y1, Cx, Cy, By);
    const [x2p, y2p] = rotate(x2, y2, Cx, Cy, By);
    return {
      x1: x1p - (rotateMap ? col : 0),
      y1: y1p - (rotateMap ? row : 0),
      x2: x2p - (rotateMap ? col : 0),
      y2: y2p - (rotateMap ? row : 0),
      open,
    };
  });
  return (
    <Container>
      <svg
        viewBox={`0 0 ${5 * CELL_PX} ${5 * CELL_PX}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {rotatedWallCoords.map(({ x1, y1, x2, y2 }, i) => (
          <line
            key={JSON.stringify({ x1, y1, x2, y2, i })}
            x1={(x1 + OFFSET) * CELL_PX}
            y1={(y1 + OFFSET) * CELL_PX}
            x2={(x2 + OFFSET) * CELL_PX}
            y2={(y2 + OFFSET) * CELL_PX}
            stroke={"black"}
            strokeWidth={3}
          />
        ))}
        {rotatedDoorCoords.map(({ x1, y1, x2, y2, open }, i) => (
          <line
            key={JSON.stringify({ x1, y1, x2, y2, i })}
            x1={(x1 + OFFSET) * CELL_PX}
            y1={(y1 + OFFSET) * CELL_PX}
            x2={(x2 + OFFSET) * CELL_PX}
            y2={(y2 + OFFSET) * CELL_PX}
            stroke={open ? "blue" : "red"}
            strokeWidth={3}
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
        ️️️️⬆️️
      </Avatar>
      {monstersCoords.map(({ x, y, type }) => (
        <Avatar
          key={JSON.stringify({ x, y })}
          style={{
            left: x * CELL_PX,
            top: y * CELL_PX,
          }}
        >
          {type !== 0 ? "🐉" : null}
        </Avatar>
      ))}
    </Container>
  );
};
