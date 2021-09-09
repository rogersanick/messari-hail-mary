/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ethers } from "hardhat";
import { Mongoose } from "mongoose";

import { getLatestABI } from './utils/getLatestABI';
import { generateHistoricalStates, groupEventByProposalID } from "./utils/getHistoricalStates";
import initializeClient from './database';
import {
  GovernorAlphaProposal, 
  GovernorAlphaProposalModelType,
  GovernorAlphaProposalSchema,
  GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME
} from './models/ProposalModel';

import { GovernorAlphaABI } from '../types/ethers-contracts/index';

async function main() {

  // Retrieve the contract ABI
  const provider = ethers.getDefaultProvider()
  const currentBlockNumber = await provider.getBlockNumber()
  const abi = await getLatestABI()
  const contract = await new ethers.Contract(
    process.env.GOVERNOR_ALPHA_CONTRACT_ADDRESS || "",
    JSON.parse(abi),
    provider
  ) as GovernorAlphaABI;

  // Get all emitted events related to proposals to generate historical states
  const createEvents = await contract.queryFilter(contract.filters.ProposalCreated(null,null,null,null,null,null,null,null,null))
  const cancelEvents = await contract.queryFilter(contract.filters.ProposalCanceled(null))
  const executeEvents = await contract.queryFilter(contract.filters.ProposalExecuted(null))
  const queueEvents = await contract.queryFilter(contract.filters.ProposalQueued(null, null))

  // Group the events by proposal ID for easy access in event formatted
  const groupedEvents = groupEventByProposalID([...createEvents, ...cancelEvents, ...executeEvents, ...queueEvents])

  // Store all of the retrieved events
  const client: Mongoose = await initializeClient()
  const GovernorAlphaProposalModel = client.model<GovernorAlphaProposalModelType>(GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME, GovernorAlphaProposalSchema);
  createEvents.forEach(async createdEvent => {
    const ID = createdEvent.args!.id
    const historicalStates = await generateHistoricalStates(contract, createdEvent, groupedEvents[ID], currentBlockNumber)
    const formattedData = new GovernorAlphaProposal(createdEvent, historicalStates)
    GovernorAlphaProposalModel.findOneAndUpdate(
      { id: formattedData.id },
      formattedData,
      { upsert: true, new: true }
    ).then((record) => {
        console.log(`Successfully saved record with id ${record.id}`);
    }).catch((err: Error) => console.log(err));
  })
} 

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    console.log("Process Complete")
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });