/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ethers } from 'hardhat';
import { Mongoose } from 'mongoose';
import { Event } from 'ethers';

import { getLatestABI } from './utils/getLatestABI';
// eslint-disable-next-line import/extensions
import { logger } from './utils/Logger';
import { generateHistoricalStates, groupEventByProposalID } from './utils/getHistoricalStates';
import initializeClient from './database';
import {
  GovernorAlphaProposal,
  GovernorAlphaProposalModelType,
  GovernorAlphaProposalSchema,
  GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME,
} from './models/ProposalModel';

import { GovernorAlphaABI } from '../types/ethers-contracts/index';

export async function buildProposalStore(): Promise<void> {
  // Retrieve the contract ABI
  logger.info('Initiating process');
  logger.info('Obtaining required resources information');
  const provider = ethers.getDefaultProvider();
  const currentBlockNumber = await provider.getBlockNumber();
  const abi = await getLatestABI();
  const contract = await new ethers.Contract(
    process.env.GOVERNOR_ALPHA_CONTRACT_ADDRESS || '',
    JSON.parse(abi),
    provider,
  ) as GovernorAlphaABI;

  // Get all emitted events related to proposals to generate historical states
  logger.info('Retrieving emitted events from contract');
  const [createEvents, cancelEvents, executeEvents, queueEvents]: Event[][] = await Promise.all([
    await contract.queryFilter(contract.filters.ProposalCreated(null, null, null, null, null, null, null, null, null)),
    await contract.queryFilter(contract.filters.ProposalCanceled(null)),
    await contract.queryFilter(contract.filters.ProposalExecuted(null)),
    await contract.queryFilter(contract.filters.ProposalQueued(null, null)),
  ]);
  logger.info(`Events successfully retrieved from contract with address: ${contract.address}`);

  // Group the events by proposal ID for easy access in event formatted
  logger.info('Processing events for storage');
  const groupedEvents = groupEventByProposalID([...createEvents, ...cancelEvents, ...executeEvents, ...queueEvents]);
  logger.info('Events successfully processed');

  // Store all of the retrieved events
  logger.info('Generating and storing representation of proposals');
  const client: Mongoose = await initializeClient();
  const GovernorAlphaProposalModel = client.model<GovernorAlphaProposalModelType>(
    GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME, GovernorAlphaProposalSchema);
  await Promise.all(createEvents.map(async (createdEvent) => {
    const ID = createdEvent.args!.id;
    const historicalStates = await generateHistoricalStates(
      contract, createdEvent, groupedEvents[ID], currentBlockNumber);
    const formattedData = new GovernorAlphaProposal(createdEvent, historicalStates);
    return GovernorAlphaProposalModel.findOneAndUpdate(
      { id: formattedData.id },
      formattedData,
      { upsert: true, new: true },
    ).then((record) => {
      logger.info(`Successfully saved record with id ${record.id}`);
    }).catch((err: Error) => logger.info(`Failed to persist record with id: ${ID}, error is: ${err}`));
  }));
}
