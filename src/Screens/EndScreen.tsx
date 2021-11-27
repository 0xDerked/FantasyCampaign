import * as React from "react";
import { AbsoluteCenterFill } from "../components/Layout";
import styled from "styled-components";

const Title = styled.div`
  font-size: 11px;
  margin-bottom: 5px;
  margin-top: 0;
  padding: 0;
  text-align: center;
`;

const Container = styled(AbsoluteCenterFill)`
  padding: 30px;
`;

export const EndScreen = () => {
  return (
    <Container>
      <Title>You have vanquished the dragon!</Title>
      <Title>It flies away, never to be seen again!</Title>
    </Container>
  );
};
