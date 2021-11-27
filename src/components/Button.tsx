import styled from "styled-components";
import { scale } from "../utils/scale";

const ButtonBase = styled.button`
  appearance: none;
  font-family: inherit;
  border-radius: 0;
  outline: none;
  text-align: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.disabled ? 0.2 : 1)};
`;

export const ButtonLarge = styled(ButtonBase)`
  background-color: black;
  border: 1px double #48865f;
  padding: 2px 5px;
  color: white;
  font-size: 7px;
`;

export const ButtonAttack = styled(ButtonBase)`
  background-color: red;
  border: ${scale(3)}px double white;
  padding: ${scale(9)}px;
  color: white;
  font-size: ${scale(20)}px;
`;

export const ButtonSecondary = styled(ButtonBase)`
  background-color: transparent;
  border: 1px double transparent;
  padding: 5px;
  color: white;
  font-size: 7px;
`;

export const ButtonText = styled(ButtonBase)`
  background-color: transparent;
  border: none;
  padding: 5px;
  color: white;
  font-size: 9px;
`;
