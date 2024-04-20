const { sequelize, sync, set_ScanStatus, get_ScanStatus, put_Proposal } = require('../lib/db.js');
const {sleep, parseDate} = require("../lib/utils.js");
const {fetch_proposal, fetch_latest_block_height} = require("../lib/rcp.js");

const is_matched = (proposal, latest_block_height) => {
  // console.log(JSON.stringify(proposal));

  const msgtype = proposal["proposal"]["content"]["@type"];

  if (!["/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade", "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal"].includes(msgtype)) {
    return false;
  }

  const upgrade_height = parseInt(proposal["proposal"]["content"]["plan"]["height"]);
  if (upgrade_height <= latest_block_height) {
    return false;
  }

  const proposal_status = proposal["proposal"]["status"];
  if (proposal_status === "PROPOSAL_STATUS_PASSED") {
    return true;
  } else if (proposal_status === "PROPOSAL_STATUS_REJECTED") {
    return false;
  } else if (proposal_status === "PROPOSAL_STATUS_FAILED") {
    return false;
  } else if (proposal_status === "PROPOSAL_STATUS_VOTING_PERIOD") {
    return true;
  } else if (proposal_status === "PROPOSAL_STATUS_DEPOSIT_PERIOD") {
    return true;
  } else if (proposal_status === "PROPOSAL_STATUS_UNSPECIFIED") {
    return true;
  }

  return false;
}

const start = async (chain) => {
  console.log(`[${chain}] start....`)

  await sync();

  let last_id = 0;
  {
    const ss = await get_ScanStatus(chain);
    if (ss == null) {
      last_id = 1;
    } else {
      last_id = ss['last_id'];
    }
  }

  while (true) {
    console.log(`[${chain}] scanning ${last_id}`);
    await sleep(1000);

    try {
      const proposal = await fetch_proposal(chain, last_id);
      if (proposal == null) {
        console.log(`[${chain}] proposal ${last_id} is null`);

        // to know if this is missing proposal id or not. We'll fetch next 5 proposals.
        // if one of them exist then it is the missing proposal id.
        const proposal_1 = await fetch_proposal(chain,last_id + 1);
        const proposal_2 = await fetch_proposal(chain,last_id + 2);
        const proposal_3 = await fetch_proposal(chain,last_id + 3);
        const proposal_4 = await fetch_proposal(chain,last_id + 4);
        const proposal_5 = await fetch_proposal(chain,last_id + 5);
        if ((proposal_1 !== null) ||
          (proposal_2 !== null) ||
          (proposal_3 !== null) ||
          (proposal_4 !== null) ||
          (proposal_5 !== null)) {
          console.log(`[${chain}] proposal ${last_id} is the missing proposal, continue...`);
          last_id++;
          await set_ScanStatus(chain, last_id);
          continue
        }

        // stop processing here
        console.log(`[${chain}] done`);
        break;
      }

      const latest_block_height = await fetch_latest_block_height(chain);

      if (is_matched(proposal, latest_block_height)) {
        console.log(`[${chain}] found proposal matched ${last_id}`);
        const p = {
          id: `${chain}_${proposal['proposal']['proposal_id']}`,
          chain,
          proposal_id: last_id,
          status: proposal['proposal']['status'],
          name: proposal['proposal']['content']['plan']['name'],
          height: parseInt(proposal['proposal']['content']['plan']['height']),
          voting_end_time: parseDate(proposal['proposal']['voting_end_time']),
        }
        await put_Proposal(p);
      }

      last_id++;
      await set_ScanStatus(chain, last_id);
    } catch (e) {
      console.log(`[${chain}] err when processing, retrying...`);
    }
  }

}

module.exports = {start, is_matched};
