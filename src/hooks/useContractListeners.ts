import { useCallback, useEffect } from "react";
import { useGameData } from "./useGameData";
import { useContracts } from "./useContracts";

export const useContractListeners = () => {
  const [gameState] = useGameData();
  const { castleCampaignContract } = useContracts();

  const filterStarted = castleCampaignContract.filters.CampaignStarted(
    gameState.selectedTokenId
  );
  const filterEnded = castleCampaignContract.filters.CampaignEnded(
    gameState.selectedTokenId
  );
  const filterTurnSet = castleCampaignContract.filters.TurnSet(
    gameState.selectedTokenId
  );
  const filterTurnStart = castleCampaignContract.filters.TurnStarted(
    gameState.selectedTokenId
  );
  const filterTurnCompleted = castleCampaignContract.filters.TurnCompleted(
    gameState.selectedTokenId
  );
  const filterCombat = castleCampaignContract.filters.CombatSequence(
    gameState.selectedTokenId
  );

  const campaignStartedListener = useCallback((...args) => {
    console.log("campaignStartedListener", ...args);
  }, []);

  const campaignEndedListener = useCallback((...args) => {
    console.log("campaignEndedListener", ...args);
  }, []);

  const turnSetListener = useCallback((...args) => {
    console.log("turnSetListener", ...args);
  }, []);

  const turnStartedListener = useCallback((...args) => {
    console.log("turnStartedListener", ...args);
  }, []);

  const turnCompletedListener = useCallback((...args) => {
    console.log("turnCompletedListener", ...args);
  }, []);
  const combatListener = useCallback((...args) => {
    console.log("combatListener", ...args);
  }, []);

  useEffect(() => {
    castleCampaignContract.on(filterStarted, campaignStartedListener);
    castleCampaignContract.on(filterEnded, campaignEndedListener);
    castleCampaignContract.on(filterTurnSet, turnSetListener);
    castleCampaignContract.on(filterTurnStart, turnStartedListener);
    castleCampaignContract.on(filterTurnCompleted, turnCompletedListener);
    castleCampaignContract.on(filterCombat, combatListener);
    return () => {
      castleCampaignContract.removeAllListeners(); //no event provided unsubscribes for all events
    };
  }, []);
};

export const ContractListeners = () => {
  useContractListeners();
  return null;
};
