import { BigNumber, ethers } from "ethers";
import FantasyCharacter from "../../artifacts/contracts/FantasyCharacter.sol/FantasyCharacter.json";
import { CharacterAttributes, CharacterStatsDictionary } from "../types";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";
import CastleCampaign from "../../artifacts/contracts/CastleCampaign.sol/CastleCampaign.json";

export const fetchAllMintedCharacters = async (
  signer: JsonRpcSigner | null
): Promise<CharacterStatsDictionary | null> => {
  if (!signer) {
    return null;
  }
  const address = await signer.getAddress();
  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    FantasyCharacter.abi,
    signer
  );
  const rawTokenIds: BigNumber[] = await contract.getAllCharacters(address);
  const tokenIds = rawTokenIds.map(id => id.toNumber());
  const promises = tokenIds.map(tokenId => contract.getPlayer(tokenId));
  const characters: CharacterAttributes[] = await Promise.all(promises);
  const characterMap: CharacterStatsDictionary = {};
  for (let character of characters) {
    const tokenId = character.id.toString();
    characterMap[tokenId] = character;
  }
  return characterMap;
};
export const FETCH_MINTED_CACHE_KEY = "allMintedCharacters";

export const createCharacter = async (
  signer: JsonRpcSigner | null,
  characterId: number | null
) => {
  if (!signer) {
    return null;
  }
  if (!signer) {
    return null;
  }
  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    FantasyCharacter.abi,
    signer
  );
  const transaction = await contract.createCharacter(characterId);
  await transaction.wait();
};
export const CREATE_CHARACTER_CACHE_KEY = "createCharacter";

export const enterCampaign = async (
  signer: JsonRpcSigner | null,
  characterToken: number
) => {
  if (!signer) {
    return null;
  }
  const contract = new ethers.Contract(
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    CastleCampaign.abi,
    signer
  );
  const turn = await contract.playerTurn(characterToken);
  const turnNumber = turn.toNumber();
  if (turnNumber === 0) {
    await contract.enterCampaign(characterToken);
  }
};
export const ENTER_CAMPAIGN_CACHE_KEY = "enterCampaign";
