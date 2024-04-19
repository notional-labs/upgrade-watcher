require('dotenv').config({ path: '.env', debug: true });

const {start} = require('./scanner.js');

(async () => {
  await start();
})();
