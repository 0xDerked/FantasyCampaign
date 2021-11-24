import * as React from "react";
import { CharacterAbilities, CharacterAttributes } from "../types";
import styled from "styled-components";

const Table = styled.table``;
const Td = styled.td`
  font-size: 6px;
`;

export const StatsTable = ({
  character,
}: {
  character: CharacterAttributes;
}) => {
  const data: Record<string, number | string> = {};
  for (const [key, value] of Object.entries(character)) {
    if (key === "id" || key === "tokenId") {
      continue;
    }
    if (key === "abilities") {
      data[key] = (value as CharacterAbilities[]).map(a => a.name).join(", ");
    } else {
      data[key] = value as unknown as string;
    }
  }
  return (
    <Table>
      <tbody>
        {Object.entries(data).map(([key, value]) => {
          return (
            <tr key={key}>
              <Td>{key}</Td>
              <Td>{value}</Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
