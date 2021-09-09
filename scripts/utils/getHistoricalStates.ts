/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from "@ethersproject/bignumber";
import { Event } from "@ethersproject/contracts";
import { GovernorAlphaABI } from "../../types/ethers-contracts";
import { GovernorAlphaProposalHistoricalStatesModelType, PROPOSAL_STATES } from "../models/ProposalModel";

export async function generateHistoricalStates(
    contract: GovernorAlphaABI,
    createdEvent: Event,
    allEvents: Event[], 
    currentBlock: number
): Promise<GovernorAlphaProposalHistoricalStatesModelType[]> {
    const historicalStates: Array<GovernorAlphaProposalHistoricalStatesModelType> = []
    const { startBlock, endBlock } = createdEvent.args! as any;
    const intProposalEndBlock = endBlock.toNumber()
    const intProposalStartBlock = startBlock.toNumber()
    const proposalCurrentStatus = await getCurrentStatus(createdEvent.args!.id, contract)
    allEvents.forEach(event => {
        const eventType = event.event
        const eventBlockNumber = event.blockNumber

        // Unable to track from events, requires seperate query to on-chain data
        if (proposalCurrentStatus == PROPOSAL_STATES.DEFEATED) {
            historicalStates.push({ blockNumber: endBlock, state: PROPOSAL_STATES.DEFEATED })
        }

        // Remodelling of smart contract state machine base on emitted events
        if (eventType == EVENT_TYPES.PROPOSAL_CREATED) {
            if (intProposalStartBlock > currentBlock) {
                historicalStates.push({ blockNumber: event.blockNumber, state: PROPOSAL_STATES.PENDING })
            } else {
                historicalStates.push({ blockNumber: eventBlockNumber, state: PROPOSAL_STATES.PENDING })
                historicalStates.push({ blockNumber: intProposalStartBlock, state: PROPOSAL_STATES.ACTIVE })
            }
        } else if (eventType == EVENT_TYPES.PROPOSAL_QUEUED) {
            historicalStates.push({ blockNumber: intProposalEndBlock, state: PROPOSAL_STATES.SUCCEEDED })
            historicalStates.push({ blockNumber: event.blockNumber, state: PROPOSAL_STATES.QUEUED })

            // Can only be in the expired state if QUEUED
            // TODO: This could also be determined based on the ETA field emitted on the Queue event.
            if (proposalCurrentStatus == PROPOSAL_STATES.EXPIRED) {
                // Blocknumber retrieved from sum of queue event block number and the constant
                // timelock delay found at the Compound Protocol Timelock smart contract. 
                // The constructor argument for which can be verified here: 
                // https://dashboard.tenderly.co/contract/mainnet/0x6d903f6003cca6255d85cca4d3b5e5146dc33925/source
                historicalStates.push({ blockNumber: event.blockNumber + 172800, state: PROPOSAL_STATES.EXPIRED })
            }

        } else if (eventType == EVENT_TYPES.PROPOSAL_EXECUTED) {
            historicalStates.push({ blockNumber: event.blockNumber, state: PROPOSAL_STATES.EXECUTED })
        } else if (eventType == EVENT_TYPES.PROPOSAL_CANCELED) {
            historicalStates.push({ blockNumber: event.blockNumber, state: PROPOSAL_STATES.CANCELED })
        }
    })
    return historicalStates;
}

async function getCurrentStatus(ID: BigNumber, contract: GovernorAlphaABI) {
    const state = await contract.state(ID)
    return Object.values(PROPOSAL_STATES)[state]
}

enum EVENT_TYPES {
    PROPOSAL_CREATED = "ProposalCreated",
    PROPOSAL_QUEUED = "ProposalQueued",
    PROPOSAL_EXECUTED = "ProposalExecuted",
    PROPOSAL_CANCELED = "ProposalCanceled"
}

export function groupEventByProposalID(events: Event[]): { [key: number]: Event[] } {
    const processedEvents: { [key: number]: Event[] } = {};
    events.forEach(event => {
        const proposalId = (event.args![0] as BigNumber).toNumber()
        if (processedEvents[proposalId]) {
            processedEvents[proposalId].push(event);
        } else {
            processedEvents[proposalId] = [ event ];
        }
    })
    return processedEvents;
}
