import { BigNumber } from '@ethersproject/bignumber';
import { Schema, SchemaTypes } from 'mongoose';

export function convertRecordToSchemaData({
  id,
  proposer,
  targets,
  signatures,
  calldatas,
  startBlock,
  endBlock,
  description
}: any): GovernorAlphaProposal {

  // If any of the arguments are provided, the data is malformed.
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] === undefined) { throw new Error("The record is malformed.") }
  }
   
  return {
    id,
    proposer,
    // Read only arrays must be converted to type [] for mongoose
    targets: targets.concat(),
    signatures: signatures.concat(),
    calldatas: calldatas.concat(),
    startBlock: startBlock,
    endBlock: endBlock,
    description: description
  };
}

export const GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME = "GovernorAlphaProposal"

export interface GovernorAlphaProposal {
  id: BigNumber,
  proposer: string,
  targets: string[],
  signatures: string[],
  calldatas: string[],
  startBlock: BigNumber
  endBlock: BigNumber,
  description: string
}

export const GovernorAlphaProposalSchema = new Schema<GovernorAlphaProposal>({
    id: { type: SchemaTypes.Mixed, required: true, unique: true },
    proposer: { type: String, required: true },
    targets: { type: [SchemaTypes.String], required: true },
    signatures: { type: [String], required: true },
    calldatas: { type: [String], required: true },
    startBlock: { type: SchemaTypes.Mixed, required: true },
    endBlock: { type: SchemaTypes.Mixed, required: true },
    description: { type: String, required: true }
});
