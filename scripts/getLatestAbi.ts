import fs from 'fs';
import path from 'path';

import { getLatestABI } from './utils/getLatestABI';

async function main() {
  const abi = await getLatestABI();
  const pathName = path.resolve(__dirname, '../data/abi/GovernorAlphaABI.abi')
  console.log("PROCESS STARTED: Retrieving API from etherscan and writing to data/abi dist folder.")
  await fs.writeFileSync(pathName, abi, 'utf-8')
  console.log(`SUCCESS: Retrieved ABI from etherscan. Data written to: ${pathName} `)
}

main().catch(console.error);