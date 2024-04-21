const { Proposal } = require('../lib/db.js');
const {fetch_proposal, fetch_latest_block_height, fetch_future_block_time} = require("../lib/rcp.js");

const process_update_status = async () => {
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
      console.log(`[${p.chain}] err when processing, continue...`);
    }
  }
}

const process_untrack = async () => {
  console.log("Remove proposals which no longer needed");
  const proposals = await Proposal.findAll();

  for (let p of proposals) {
    try {
      if (["PROPOSAL_STATUS_REJECTED", "PROPOSAL_STATUS_FAILED"].includes(p.status)) {
        await p.destroy();
      } else {
        // check passed upgrade time
        const latest_block_height = await fetch_latest_block_height(p.chain);
        if (latest_block_height >= p.height) {
          await p.destroy();
        }
      }
    } catch (e) {
      console.log(`[${p.chain}] err when processing, continue...`);
    }
  }
}

const process_estimate_upgrade_time = async () => {
  console.log("Update estimated upgraded time");
  const proposals = await Proposal.findAll();

  for (let p of proposals) {
    try {
      const estimated_time = await fetch_future_block_time(p.chain, p.height);
      p.estimated_time = estimated_time;
      await p.save();
    } catch (e) {
      console.log(`[${p.chain}] err when processing, continue...`);
    }
  }
}

const start = async () => {
  console.log(`tracker start....`);

  try {
    await process_update_status();
    await process_untrack();
    await process_estimate_upgrade_time();
  } catch (e) {
    console.log(`[${p.chain}] tracker: err when processing, continue...`);
  }
  console.log("Done!");
}

module.exports = {start};
