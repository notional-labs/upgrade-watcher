const { parseDate, estimate_future_block_time } = require('./utils.js');

describe('parseDate', () => {
  // "voting_end_time": "2024-04-19T14:23:58.311259611Z"
  it('test voting_end_time 2024-04-19T14:23:58.311259611Z', async () => {
    const dt = parseDate("2024-04-19T14:23:58.311259611Z");
    console.log(JSON.stringify(dt));
    expect(dt).toBe(1713536638311);
  })
});

describe('estimate_future_block_time', () => {
  it('test voting_end_time 2024-04-19T14:23:58.311259611Z', async () => {

    const future_height = 1159000;
    const current_height = 1113605;
    const current_time = parseDate("2024-04-20T14:11:39Z");
    const previous_time = parseDate("2024-04-20T14:02:15Z");
    const diff_block = 100;

    const estimated_time = estimate_future_block_time({future_height, current_height, current_time, previous_time, diff_block});
    console.log(JSON.stringify(estimated_time));
    expect(estimated_time).toBe(1713878326800);
  })
});
