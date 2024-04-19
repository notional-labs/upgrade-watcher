const { sequelize, sync, set_ScanStatus, get_ScanStatus } = require('../lib/db.js');
const {sleep} = require("../lib/utils.js");

const fetch_proposal = async (proposal_id) => {
  // not found proposal return: {"code":5,"message":"proposal 900 doesn't exist","details":[]}

  const url = `https://api-osmosis-ia.cosmosia.notional.ventures/cosmos/gov/v1beta1/proposals/${proposal_id}`;
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }

  throw new Error("fetch_proposal error");
}

const

const start = async () => {
  console.log("start....")

  await sync();

  let last_id = 0;
  {
    const ss = await get_ScanStatus("osmosis");
    if (ss == null) {
      last_id = 1;
    } else {
      last_id = ss['last_id'];
    }
  }

  while (true) {
    await sleep(5000);
    const proposal = await fetch_proposal(last_id);
    if (proposal == null) {
      console.log(`proposal ${last_id} is null`);
      continue;
    }

    console.log(JSON.stringify(proposal));

    if (proposal["proposal"]["content"]["@type"])


    last_id++;
    await set_ScanStatus("osmosis", last_id);
  }

}

module.exports = {start};
