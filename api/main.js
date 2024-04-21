require('dotenv').config({ path: '.env', debug: true });
const server = require('./server');
const { sync } = require('../lib/db.js');

(async () => {
  await sync();
  server.start(); // http server
})();
