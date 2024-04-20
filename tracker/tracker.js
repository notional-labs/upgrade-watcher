const { sync, Proposal } = require('../lib/db.js');
const {fetch_proposal, fetch_latest_block_height} = require("../lib/rcp.js");

const start = async (chain) => {
  console.log(`[${chain}] start....`);

  await sync();

  ////////////////////////////////
  console.log("Update status for tracked proposals");
  let proposals = await Proposal.findAll();
  // console.log(JSON.stringify(proposals));

  for (let p of proposals) {
    try {
      const proposal = await fetch_proposal(p.chain, p.proposal_id);
      const status_new = proposal['proposal']['status'];
      if (p.status !== status_new) {
        p.status = proposal['proposal']['status'];
        await p.save();
      }
    } catch (e) {
      console.log(`[${chain}] err when processing, retrying...`);
    }
  }

  ////////////////////////////////
  console.log("Remove proposals which no longer needed");
  proposals = await Proposal.findAll();

  for (let p of proposals) {
    try {
      if (p.status === "PROPOSAL_STATUS_REJECTED") {
        await p.destroy();
      } else {
        // check passed upgrade time
        const latest_block_height = await fetch_latest_block_height(p.chain);
        if (latest_block_height >= p.height) {
          await p.destroy();
        }
      }
    } catch (e) {
      console.log(`[${chain}] err when processing, retrying...`);
    }
  }
}

module.exports = {start};
