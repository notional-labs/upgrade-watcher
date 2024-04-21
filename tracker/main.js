require('dotenv').config({ path: '.env', debug: true });
const { sync } = require('../lib/db.js');
const {start} = require('./tracker.js');

(async () => {
  const chains = "dymension".split(' ');
  await sync();
  await start(chains);
})();
