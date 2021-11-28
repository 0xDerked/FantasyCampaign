import * as React from "react";
import styled from "styled-components";
import { UserInterfaceListeners } from "./hooks/useInterfaceEventsListeners";
import { useGameData } from "./hooks/useGameData";
import {
  GameDataProvider,
  initialGameData,
} from "./providers/GameDataProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { Router } from "./routes/Router";

export const queryClient = new QueryClient();

const GameScreenContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: #282c34;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transform: scale(4);
  user-select: none;
`;

const ClearStorageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  color: red;
  background-color: transparent;
  font-family: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  opacity: 0;
`;

const ClearStorage = () => {
  const [, setGameData] = useGameData();
  const handleClearStorage = () => {
    localStorage.clear();
    setGameData(initialGameData);
  };
  return (
    <ClearStorageButton onClick={handleClearStorage}>
      Clear storage
    </ClearStorageButton>
  );
};

function App() {
  return (
    <GameDataProvider>
      <QueryClientProvider client={queryClient}>
        <UserInterfaceListeners />
        <GameScreenContainer>
          <Router />
        </GameScreenContainer>
        <ClearStorage />
      </QueryClientProvider>
    </GameDataProvider>
  );
}

export default App;
