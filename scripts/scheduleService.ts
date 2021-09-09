import cron from 'node-cron';

import { buildProposalStore } from './buildProposalStore';
import { logger } from './utils/Logger';

async function main() {
  logger.info('Job scheduler initialized. Waiting for next execution');
  let runID = 0;
  cron.schedule('0 * * * *', async () => {
    try {
      logger.info(`Scheduling job with ${runID++} for execution at ${new Date().getTime()}`);
      await buildProposalStore();
      logger.info(`Job with ${runID++} completed at ${new Date().getTime()}`);
    } catch (e) {
      logger.info(`Job with ${runID++} failed with exception: ${e}`);
    }
  });
}

main();
