import { ethers } from "hardhat";
import { resolve } from "path/posix";
import getLatestABI from './utils/getLatestABI';

async function main() {
  const provider = ethers.getDefaultProvider()
  const abi = await getLatestABI()
  const contract = await new ethers.Contract(
    process.env.GOVERNOR_ALPHA_CONTRACT_ADDRESS || "",
    JSON.parse(abi),
    provider
  )
  const currentBlock = await provider.getBlockNumber()

  const eventKey = 'ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)'
  const eventFilter = contract.filters[eventKey]()
  const results = await contract.queryFilter(eventFilter, 10000000)
  results.forEach(event => {
    console.log(event.args ? event.args[8] : "No Description Provided");
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });