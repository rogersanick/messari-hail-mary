import { buildProposalStore } from './buildProposalStore';
import { logger } from './utils/Logger';

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
buildProposalStore().then(() => {
  logger.info('Process Completed Successful');
  process.exit(0);
}).catch((error) => {
  logger.error(`Process failed with exception: ${error}`);
  process.exit(1);
});
