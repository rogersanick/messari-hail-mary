import fs from 'fs';
import path from 'path';

import { getLatestABI } from './utils/getLatestABI';
import { logger } from './utils/Logger'

async function main() {
  const abi = await getLatestABI();
  const pathName = path.resolve(__dirname, '../data/abi/GovernorAlphaABI.abi');
  logger.info('PROCESS STARTED: Retrieving API from etherscan and writing to data/abi dist folder.');
  try {
    await fs.writeFileSync(pathName, abi, 'utf-8');
    logger.info(`SUCCESS: Retrieved ABI from etherscan. Data written to: ${pathName} `);
  } catch(e) {
    logger.error(`FAILURE: Unable to retrieve application abi. Failed with message ${e}`)
  }
  
}

main().catch(logger.error);
