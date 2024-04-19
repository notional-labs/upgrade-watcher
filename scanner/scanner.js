const { sequelize, sync, set_ScanStatus, get_ScanStatus } = require('../lib/db.js');
const {sleep} = require("../lib/utils.js");

const fetch_proposal = async (chain, proposal_id) => {


  const url = `http:///a-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net/cosmos/gov/v1beta1/proposals/${proposal_id}`;
  // console.log(url);
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    const data = await response.json();
    if ((response.status === 404) && (data["code"] === 5)) {
      // not found proposal return: {"code":5,"message":"proposal 900 doesn't exist","details":[]}
      return null;
    } else if ((response.status === 500) && (data["code"] === 2)) {
      // 500: {
      //   "code": 2,
      //   "message": "codespace sdk code 29: invalid type: can't convert a gov/v1 Proposal to gov/v1beta1 Proposal when amount of proposal messages not exactly one",
      //   "details": []
      // }
      return null;
    }
  }

  throw new Error("fetch_proposal error");
}

const get_latest_block_height = async (chain) => {
  const url = `http:///r-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net/status`;
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    return parseInt(data["result"]["sync_info"]["latest_block_height"]);
  }

  throw new Error("fetch_proposal error");
}

const is_matched = (proposal, latest_block_height) => {
  // console.log(JSON.stringify(proposal));
  if (proposal["proposal"]["content"]["@type"] !== "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade") {
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
  } else if (proposal_status === "PROPOSAL_STATUS_FAILED") {
    return false;
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
    await sleep(5000);

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

        // TODO: sleep an hour to retry in production
        await sleep(10000);
        console.log(`[${chain}] retrying proposal ${last_id}...`);
        continue;
      }

      const latest_block_height = await get_latest_block_height(chain);

      if (is_matched(proposal, latest_block_height)) {
        console.log(`[${chain}] found proposal matched ${last_id}`);
      }

      last_id++;
      await set_ScanStatus(chain, last_id);
    } catch (e) {
      console.log(`[${chain}] err when processing, retrying...`);
    }
  }

}

module.exports = {start};
