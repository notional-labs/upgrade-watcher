require('dotenv').config({ path: '.env', debug: true });
const server = require('./server');
// const cron = require('./cron');

////////////////////////
// http server
server.start();


////////////////////////
// cronjob
// cron.cron_init();
