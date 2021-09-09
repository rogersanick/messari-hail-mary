import { buildProposalStore } from './buildProposalStore';

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
buildProposalStore().then(() => {
  console.log('LOG: Process Completed Successful');
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
