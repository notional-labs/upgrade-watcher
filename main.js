require('dotenv').config({path: '.env', debug: true});
const cron = require('node-cron');
const {sleep} = require("./lib/utils.js");
const {sync} = require('./lib/db.js');
const api = require('./api/server');
const scanner = require('./scanner/scanner.js');
const tracker = require('./tracker/tracker.js');

let running = false; // indicate cronjob is running, to make sure only one job is running at a time.
const cronjob = async () => {
  if (running) {
    return;
  }

  try {
    await scanner.start();
    await tracker.start();

    await sleep(60000);
  } catch (e) {
    console.log("cronjob: error=", e);
  } finally {
    console.log('cronjob done!');
    running = false;
  }
}

(async () => {
  await sync();
  api.start(); // http server

  // cronjob
  cron.schedule('0 0 * * * *', cronjob); // every hour
})();
