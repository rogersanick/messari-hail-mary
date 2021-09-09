import cron from 'node-cron';

import { buildProposalStore } from './buildProposalStore';

async function main() {
  console.log('LOG: Job scheduler initialized. Waiting for next execution');
  let runID = 0;
  cron.schedule('0 * * * *', async () => {
    try {
      console.log(`LOG: Scheduling job with ${runID++} for execution at ${new Date().getTime()}`);
      await buildProposalStore();
      console.log(`LOG: Job with ${runID++} completed at ${new Date().getTime()}`);
    } catch (e) {
      console.log(`LOG: Job with ${runID++} failed with exception: ${e}`);
    }
  });
}

main();
