require('dotenv').config({ path: '.env', debug: true });
const server = require('./server');
const { sync } = require('../lib/db.js');
// const cron = require('./cron');

////////////////////////
// cronjob
// cron.cron_init();


(async () => {
  await sync();
  server.start(); // http server
})();
