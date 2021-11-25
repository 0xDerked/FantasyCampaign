import { BigNumber, ethers } from "ethers";
import { CharacterStatsDictionary, TurnType } from "../types";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

import Web3Modal from "web3modal";
import { characterStats } from "../constants";
import { CharacterAttributesStructOutput } from "../../typechain/FantasyAttributesManager";
import { Contracts } from "../providers/ContractsProvider";

// --------------------------------------------------------------------------------

export const fetchAllMintedCharacters = async ({
  signer,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  contracts: Contracts;
}): Promise<CharacterStatsDictionary | null> => {
  if (!signer) {
    return null;
  }
  const address = await signer.getAddress();

  const rawTokenIds: BigNumber[] =
    await contracts.fantasyCharacterContract.getAllCharacters(address);
  const tokenIds = rawTokenIds.map(id => id.toNumber());

  const characterMap: CharacterStatsDictionary = {};
  const promises = tokenIds.map(async tokenId => {
    const character: CharacterAttributesStructOutput =
      await contracts.attributesManagerContract.getPlayer(tokenId);
    const {
      abilities,
      agility,
      armor,
      class: id,
      experience,
      healingpower,
      health,
      physicalblock,
      spellpower,
      spellresistance,
      strength,
    } = character;
    const mappedAbilities = abilities.map(({ abilityType, action, name }) => ({
      abilityType,
      action,
      name,
    }));
    characterMap[id] = {
      id,
      name: characterStats[id]?.name || "Unknown",
      agility,
      armor,
      experience: experience.toNumber(),
      healingpower,
      health,
      physicalblock,
      spellpower,
      spellresistance,
      strength,
      tokenId,
      abilities: mappedAbilities,
    };
  });
  await Promise.all(promises);
  return characterMap;
};
export const FETCH_MINTED_CACHE_KEY = "allMintedCharacters";

// --------------------------------------------------------------------------------

export const createCharacter = async ({
  signer,
  characterId,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterId: number | null;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }
  if (!signer) {
    return null;
  }
  const transaction = await contracts.fantasyCharacterContract.createCharacter(
    characterId
  );
  await transaction.wait();
};
export const CREATE_CHARACTER_CACHE_KEY = "createCharacter";

// --------------------------------------------------------------------------------

export const enterCampaign = async ({
  signer,
  characterTokenId,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }

  const turn = await contracts.castleCampaignContract.playerTurn(
    characterTokenId
  );
  const turnNumber = turn.toNumber();
  if (turnNumber === 0) {
    await contracts.castleCampaignContract.enterCampaign(characterTokenId);
  }
};
export const ENTER_CAMPAIGN_CACHE_KEY = "enterCampaign";

// --------------------------------------------------------------------------------

export const generateTurn = async ({
  signer,
  characterTokenId,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }
  return await contracts.castleCampaignContract.generateTurn(characterTokenId);
};
export const GENERATE_TURN_CACHE_KEY = "generateTurn";

// --------------------------------------------------------------------------------

export const fetchSigner = async (): Promise<JsonRpcSigner> => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  return provider.getSigner();
};
export const FETCH_SIGNER_CACHE_KEY = "fetchSigner";

// --------------------------------------------------------------------------------

export const attackWithAbility = async ({
  signer,
  characterTokenId,
  abilityIndex,
  target,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  abilityIndex: number;
  target: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }

  await contracts.castleCampaignContract.attackWithAbility(
    characterTokenId,
    abilityIndex,
    target
  );
};
export const ATTACK_ABILITY_CACHE_KEY = "attackWithAbility";

// --------------------------------------------------------------------------------

export const attackWithItem = async ({
  signer,
  characterTokenId,
  itemIndex,
  target,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  itemIndex: number;
  target: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }
  await contracts.castleCampaignContract.attackWithItem(
    characterTokenId,
    itemIndex,
    target
  );
};
export const ATTACK_ITEM_CACHE_KEY = "attackWithItem";

// --------------------------------------------------------------------------------

export const castHealAbility = async ({
  signer,
  characterTokenId,
  abilityIndex,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  abilityIndex: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }
  await contracts.castleCampaignContract.castHealAbility(
    characterTokenId,
    abilityIndex
  );
};
export const HEAL_ABILITY_CACHE_KEY = "castHealAbility";

// --------------------------------------------------------------------------------

export const endExploreLoot = async ({
  signer,
  characterTokenId,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }
  await contracts.castleCampaignContract.endExploreLoot(characterTokenId);
};
export const END_LOOT_CACHE_KEY = "endExploreLoot";

// --------------------------------------------------------------------------------

export const getCampaignInventory = async ({
  signer,
  characterTokenId,
  characterNonce,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  characterNonce: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }

  await contracts.castleCampaignContract.campaignInventory(
    characterTokenId,
    characterNonce
  );
};
export const GET_INVENTORY_CACHE_KEY = "getCampaignInventory";

// --------------------------------------------------------------------------------

export const getTurnData = async ({
  signer,
  contracts,
  characterTokenId,
}: {
  signer: JsonRpcSigner | undefined;
  contracts: Contracts;
  characterTokenId: number;
}): Promise<TurnType | null> => {
  if (!signer) {
    return null;
  }

  const turnNumber = await contracts.castleCampaignContract.playerTurn(
    characterTokenId
  );
  const turnType = await contracts.castleCampaignContract.turnTypes(
    characterTokenId,
    turnNumber
  );
  return turnType;
};

// --------------------------------------------------------------------------------
//unlock final turn
// --------------------------------------------------------------------------------

export const getCurrentCampaignStatus = async ({
  signer,
  characterTokenId,
  contracts,
}: {
  signer: JsonRpcSigner | undefined;
  characterTokenId: number;
  contracts: Contracts;
}): Promise<void | null> => {
  if (!signer) {
    return null;
  }
  await contracts.castleCampaignContract.getCurrentCampaignStatus(
    characterTokenId
  );
};
export const GET_STATUS_CACHE_KEY = "getCurrentCampaignStatus";
