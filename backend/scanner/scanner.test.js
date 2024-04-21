const { is_matched } = require('./scanner.js');


describe('is_matched', () => {
  it('/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal', async () => {
    const latest_block_height = 6921809;
    const matched_proposal = {
      "proposal": {
        "proposal_id": "37",
        "content": {
          "@type": "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
          "title": "Upgrade quicksilverd to v1.5.5",
          "description": "This proposal aims to upgrade Quicksilver quicksilver-2 mainnet to v1.5.5 of quicksilverd.\\n \\nThis release contains changes as detailed here: https://github.com/quicksilver-zone/quicksilver/releases/tag/v1.5.5\\n\\n",
          "plan": {
            "name": "v1.5.5",
            "time": "0001-01-01T00:00:00Z",
            "height": "6926000",
            "info": "{\"binaries\":{\"linux/amd64\": \"https://github.com/quicksilver-zone/quicksilver/releases/download/v1.5.5/quicksilverd-v1.5.5-amd64?checksum=sha256:88ea77a9a4a53b2b059ad246bafb64d33eeddd6a8810b6ab7274017690ebdeb1\"}}",
            "upgraded_client_state": null
          }
        },
        "status": "PROPOSAL_STATUS_VOTING_PERIOD",
        "final_tally_result": {
          "yes": "0",
          "abstain": "0",
          "no": "0",
          "no_with_veto": "0"
        },
        "submit_time": "2024-04-16T14:23:58.311259611Z",
        "deposit_end_time": "2024-04-18T14:23:58.311259611Z",
        "total_deposit": [
          {
            "denom": "uqck",
            "amount": "20000000000"
          }
        ],
        "voting_start_time": "2024-04-16T14:23:58.311259611Z",
        "voting_end_time": "2024-04-19T14:23:58.311259611Z"
      }
    };

    const result = is_matched(matched_proposal, latest_block_height);
    expect(result).toBe(true);
  });

  it('/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade', async () => {
    const latest_block_height = 14820300;
    const matched_proposal = {
      "proposal": {
        "proposal_id": "763",
        "content": {
          "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
          "authority": "osmo10d07y265gmmuvt4z0w9aw880jnsr700jjeq4qp",
          "plan": {
            "name": "v24",
            "time": "0001-01-01T00:00:00Z",
            "height": "14830300",
            "info": "https://raw.githubusercontent.com/osmosis-labs/osmosis/main/networks/osmosis-1/upgrades/v24/mainnet/v24_binaries.json",
            "upgraded_client_state": null
          }
        },
        "status": "PROPOSAL_STATUS_PASSED",
        "final_tally_result": {
          "yes": "197469057600525",
          "abstain": "40443322080",
          "no": "16339630843",
          "no_with_veto": "7128429374"
        },
        "submit_time": "2024-04-06T08:48:47.008730713Z",
        "deposit_end_time": "2024-04-20T08:48:47.008730713Z",
        "total_deposit": [{"denom": "uosmo", "amount": "1600000000"}],
        "voting_start_time": "2024-04-06T08:48:47.008730713Z",
        "voting_end_time": "2024-04-11T08:48:47.008730713Z"
      }
    };

    const result = is_matched(matched_proposal, latest_block_height);
    expect(result).toBe(true);
  })
});
