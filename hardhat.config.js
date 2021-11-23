const dotenvConfig = require("dotenv").config;
const path = require("path");
dotenvConfig({ path: path.resolve(__dirname, "./.env") });

require("@nomiclabs/hardhat-waffle");
require("@typechain/hardhat");

const config = {
  defaultNetwork: "hardhat",

  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.6.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

module.exports = config;
