require('dotenv').config({ path: '.env', debug: true });
const { sync } = require('../lib/db.js');
const {start} = require('./tracker.js');

(async () => {
  await sync();
  await start();
})();
