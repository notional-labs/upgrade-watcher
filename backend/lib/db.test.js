const { sequelize, sync, set_ScanStatus, get_ScanStatus } = require('./db.js');

beforeAll(async () => {
  await sync();
});

beforeEach(async () => {
  await sequelize.truncate();
});

describe('db.test.js', () => {
  it('set_ScanStatus', async () => {
    await set_ScanStatus("osmosis", 0);

    const ss = await get_ScanStatus("osmosis");
    console.log(JSON.stringify(ss));
    expect(ss).not.toBeNull();
  })
});
