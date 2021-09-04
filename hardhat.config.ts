import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
import * as dotenv from "dotenv";
dotenv.config()
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    mainnet: {
      url: MAINNET_RPC_URL,
      chainId: 1,
    }
  }
};
