require('dotenv').config({ path: '.env', debug: true });
const { sync } = require('../lib/db.js');
const {start} = require('./scanner.js');

(async () => {
  // const chains = "dymension".split(' ');
  const chains = process.env.CHAINS.split(' ');
  await sync();
  await start(chains);
})();
