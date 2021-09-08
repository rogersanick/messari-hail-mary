import { BigNumber } from '@ethersproject/bignumber';
import { Event } from 'ethers'
import { Schema, SchemaTypes } from 'mongoose';

export const GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME = "GovernorAlphaProposal"

// This is the type representing the useful values extracted directly from the 
// returned arguments associated with an emitted event.
export interface GovernorAlphaProposalType {
  id: BigNumber,
  proposer: string,
  targets: string[],
  signatures: string[],
  calldatas: string[],
  startBlock: BigNumber,
  endBlock: BigNumber,
  description: string
}

// This type reflects the format in which the Mongoose model exists (and the 
// corresponding document which will be persisted using MongoDB)
export interface GovernorAlphaProposalModelType {
  id: number,
  proposer: string,
  targets: string[],
  signatures: string[],
  calldatas: string[],
  startBlock: number,
  endBlock: number,
  description: string,
  historicalStates: GovernorAlphaProposalHistoricalStatesModelType[]
}

// This type reflects the format in which proposal state changes will
// be persisted as part of the [GovernorAlphaProposalModelType]
export interface GovernorAlphaProposalHistoricalStatesModelType {
  state: PROPOSAL_STATES,
  blockNumber: number,
}

// All of the possible states a proposal can exist in
export enum PROPOSAL_STATES {   
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  DEFEATED = "DEFEATED",
  SUCCEEDED = "SUCCEEDED",
  QUEUED = "QUEUED",
  EXPIRED = "EXPIRED",
  EXECUTED = "EXECUTED"
}

// This is a utility class for converting an object conforming to type [GovernorAlphaProposalType]
// into the appropriate type for storage - [GovernorAlphaProposalModelType]
export class GovernorAlphaProposal implements GovernorAlphaProposalModelType {
  id: number;
  proposer: string;
  targets: string[];
  signatures: string[];
  calldatas: string[];
  startBlock: number;
  endBlock: number;
  description: string;
  historicalStates: GovernorAlphaProposalHistoricalStatesModelType[];

  constructor(event: Event, states: GovernorAlphaProposalHistoricalStatesModelType[]) {
    const args = event.args! as any;
    const {
      id,
      proposer,
      targets,
      signatures,
      calldatas,
      startBlock,
      endBlock,
      description
    }: GovernorAlphaProposalType = args
    this.id = id.toNumber()
    this.proposer = proposer
    this.targets = targets.concat()
    this.signatures = signatures.concat()
    this.calldatas = calldatas.concat()
    this.startBlock = startBlock.toNumber()
    this.endBlock = endBlock.toNumber()
    this.description = description
    this.historicalStates = states
  }
}

// A schema for historical state changes for a given proposal
export const GovernorAlphaProposalStateSchema = new Schema<GovernorAlphaProposalHistoricalStatesModelType>({
  state: { type: String, enum: Object.values(PROPOSAL_STATES), require: true },
  blockNumber: { type: Number, require: true }
})

// The schema for Governor Alpha proposal data to be persisted
export const GovernorAlphaProposalSchema = new Schema<GovernorAlphaProposalModelType>({
    id: { type: Number, required: true, unique: true },
    proposer: { type: String, required: true },
    targets: { type: [SchemaTypes.String], required: true },
    signatures: { type: [String], required: true },
    calldatas: { type: [String], required: true },
    startBlock: { type: Number, required: true },
    endBlock: { type: Number, required: true },
    description: { type: String, required: true },
    historicalStates: { type: [GovernorAlphaProposalStateSchema], required: true }
});
