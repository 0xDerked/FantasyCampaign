import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { usePositionContext } from "../providers/Position";
import { rotate } from "../utils/rotate";
import { monstersCoords, wallCoords, WallType } from "./mapData";

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
  const position = usePositionContext();
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
  return (
    <Container>
      <svg
        viewBox={`0 0 ${5 * CELL_PX} ${5 * CELL_PX}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {rotatedWallCoords.map(({ x1, y1, x2, y2, type }) => (
          <line
            key={JSON.stringify({ x1, y1, x2, y2 })}
            x1={(x1 + OFFSET) * CELL_PX}
            y1={(y1 + OFFSET) * CELL_PX}
            x2={(x2 + OFFSET) * CELL_PX}
            y2={(y2 + OFFSET) * CELL_PX}
            stroke={type === WallType.DoorFrame ? "red" : "black"}
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
