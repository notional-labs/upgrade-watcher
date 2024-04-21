const { parseDate, estimate_future_block_time } = require('./utils.js');

const fetch_proposal = async (chain, proposal_id) => {
  const url = `http://a-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net/cosmos/gov/v1beta1/proposals/${proposal_id}`;
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

const fetch_last_proposal_id = async (chain, use_v1beta1 = false) => {
  const method = use_v1beta1 ? '/cosmos/gov/v1beta1/proposals' : '/cosmos/gov/v1/proposals';
  const url = `http://a-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net${method}?pagination.limit=1&pagination.count_total=false&pagination.reverse=true`;
  // console.log(url);
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    const proposal_id = parseInt(data["proposals"][0]["id"]);
    return proposal_id;
  } else {
    const data = await response.json();
    if ((response.status === 501) && (data["code"] === 12)) {
      // { "code": 12, "message": "Not Implemented", "details": [] }
      return fetch_last_proposal_id(chain, true);
    }
  }

  throw new Error("fetch_proposal error");
}

const fetch_latest_block_height = async (chain) => {
  const url = `http://r-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net/status`;
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    return parseInt(data["result"]["sync_info"]["latest_block_height"]);
  }

  throw new Error("fetch_proposal error");
}

const fetch_future_block_time  = async (chain, future_height) => {
  const diff_block = 100;

  /////
  let response = await fetch(`http://r-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net/status`);
  if (response.status !== 200) {
    throw new Error("fetch status error");
  }
  let data = await response.json();
  const current_height = parseInt(data["result"]["sync_info"]["latest_block_height"]);
  const current_time = parseDate(data["result"]["sync_info"]["latest_block_time"]);


  /////
  const previous_height = current_height - diff_block;
  response = await fetch(`http://r-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net/block?height=${previous_height}`);
  if (response.status !== 200) {
    throw new Error("fetch status error");
  }
  data = await response.json();
  const previous_time = parseDate(data["result"]["block"]["header"]["time"]);

  /////
  const estimated_time = estimate_future_block_time({future_height, current_height, current_time, previous_time, diff_block});
  return estimated_time;
}

module.exports = {fetch_proposal, fetch_latest_block_height, fetch_future_block_time, fetch_last_proposal_id};
