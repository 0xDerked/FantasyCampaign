import styled from "styled-components";

export const Button = styled.button`
  appearance: none;
  font-family: inherit;
  background-color: black;
  border-radius: 0;
  outline: none;
  border: 1px solid blue;
  text-align: inherit;
  display: flex;
  padding: 5px;
  align-items: center;
  justify-content: inherit;
  color: white;
  opacity: ${props => (props.disabled ? 0.2 : 1)};
`;
