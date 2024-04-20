const { parseDate } = require('./utils.js');

describe('parseDate', () => {
  // "voting_end_time": "2024-04-19T14:23:58.311259611Z"
  it('test voting_end_time 2024-04-19T14:23:58.311259611Z', async () => {
    const dt = parseDate("2024-04-19T14:23:58.311259611Z");
    console.log(JSON.stringify(dt));
    expect(dt).toBe(1713536638311);
  })
});
