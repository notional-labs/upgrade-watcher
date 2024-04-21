require('dotenv').config({ path: '.env', debug: true });
const { sync } = require('../lib/db.js');
const {start} = require('./tracker.js');

(async () => {
  const chain = "dymension";
  await sync();
  await start(chain);
})();
