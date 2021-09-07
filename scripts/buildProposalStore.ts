import { ethers } from "hardhat";
import { Mongoose } from "mongoose";

import getLatestABI from './utils/getLatestABI';
import initializeClient from './database';
import { 
  convertRecordToSchemaData, 
  GovernorAlphaProposal, 
  GovernorAlphaProposalSchema,
  GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME
} from './models/ProposalModel';

import { GovernorAlphaABI } from '../types/ethers-contracts/index';

async function main() {

  // Retrieve the contract ABI
  const provider = ethers.getDefaultProvider()
  const abi = await getLatestABI()
  const contract = await new ethers.Contract(
    process.env.GOVERNOR_ALPHA_CONTRACT_ADDRESS || "",
    JSON.parse(abi),
    provider
  ) as GovernorAlphaABI;

  // Use the event key as defined by the smart contract to retrieve all events 
  // emitted with the specified key from the node.
  const eventFilter = contract.filters.ProposalCreated(null,null,null,null,null,null,null,null,null);
  const results = await contract.queryFilter(eventFilter, 10000000)

  // Store all of the retrieved events 
  const client: Mongoose = await initializeClient()
  const GovernorAlphaProposalModel = client.model<GovernorAlphaProposal>(GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME, GovernorAlphaProposalSchema);

  results.forEach(result => {
    const formattedData = convertRecordToSchemaData(result.args)
    GovernorAlphaProposalModel.findOneAndUpdate(
      { id: formattedData.id },
      formattedData,
      { upsert: true, new: true }
    ).then((record) => {
        console.log(`Successfully saved record with id ${result.args!.id.toHexString()}`);
    }).catch((err: Error) => console.log(err));
  })
} 

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {}) 
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });