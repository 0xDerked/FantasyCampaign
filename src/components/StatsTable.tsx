import * as React from "react";
import { CharacterAbilities, CharacterAttributes } from "../types";
import styled from "styled-components";

const Table = styled.table`
  border: 1px solid #523c31;
  margin-left: 3px;
`;
const Td = styled.td`
  font-size: 5px;
  padding: 1px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StatsTable = ({
  character,
}: {
  character: CharacterAttributes;
}) => {
  const data1: Record<string, number | string> = {};
  const data2: Record<string, number | string> = {};
  let rowCount = 0;
  for (const [key, value] of Object.entries(character)) {
    if (key === "id" || key === "tokenId") {
      continue;
    }
    const target = rowCount <= 5 ? data1 : data2;
    if (key === "abilities") {
      target[key] = (value as CharacterAbilities[]).map(a => a.name).join(", ");
    } else {
      target[key] = value as unknown as string;
    }
    rowCount++;
  }
  return (
    <Container>
      <Table>
        <tbody>
          {Object.entries(data1).map(([key, value]) => {
            return (
              <tr key={key}>
                <Td>{key}</Td>
                <Td>{value}</Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Table>
        <tbody>
          {Object.entries(data2).map(([key, value]) => {
            return (
              <tr key={key}>
                <Td>{key}</Td>
                <Td>{value}</Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};
