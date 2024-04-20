
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

const fetch_latest_block_height = async (chain) => {
  const url = `http:///r-${chain}--${process.env.NOTIONAL_API_KEY}.gw.notionalapi.net/status`;
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    return parseInt(data["result"]["sync_info"]["latest_block_height"]);
  }

  throw new Error("fetch_proposal error");
}

module.exports = {fetch_proposal, fetch_latest_block_height};
