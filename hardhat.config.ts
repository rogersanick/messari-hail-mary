import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
import * as dotenv from 'dotenv';

dotenv.config();
const { MAINNET_RPC_URL } = process.env;
const { ETHERSCAN_API_KEY } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    mainnet: {
      url: MAINNET_RPC_URL,
      chainId: 1,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
