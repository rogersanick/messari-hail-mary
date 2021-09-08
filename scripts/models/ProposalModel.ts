import { BigNumber } from '@ethersproject/bignumber';
import { Event } from 'ethers'
import { Schema, SchemaTypes } from 'mongoose';

export const GOVERNOR_ALPHA_PROPOSAL_MODEL_NAME = "GovernorAlphaProposal"

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

export interface GovernorAlphaProposalModelType {
  id: number,
  proposer: string,
  targets: string[],
  signatures: string[],
  calldatas: string[],
  startBlock: number,
  endBlock: number,
  description: string
}

export class GovernorAlphaProposal implements GovernorAlphaProposalModelType {

  id: number;
  proposer: string;
  targets: string[];
  signatures: string[];∂
  calldatas: string[];
  startBlock: number;
  endBlock: number;
  description: string;

  constructor(event: Event) {
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
    console.log(id.toNumber());
    console.log(startBlock.toNumber());
    console.log(endBlock.toNumber());
    console.log(id.toNumber());
    this.id = id.toNumber()
    this.proposer = proposer
    this.targets = targets.concat()
    this.signatures = signatures.concat()
    this.calldatas = calldatas.concat()
    this.startBlock = startBlock.toNumber()
    this.endBlock = endBlock.toNumber()
    this.description = description
  }

}

export const GovernorAlphaProposalSchema = new Schema<GovernorAlphaProposalModelType>({
    id: { type: Number, required: true, unique: true },
    proposer: { type: String, required: true },
    targets: { type: [SchemaTypes.String], required: true },
    signatures: { type: [String], required: true },
    calldatas: { type: [String], required: true },
    startBlock: { type: Number, required: true },
    endBlock: { type: Number, required: true },
    description: { type: String, required: true }
});
