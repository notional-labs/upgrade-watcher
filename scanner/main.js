require('dotenv').config({ path: '.env', debug: true });
const scanner = require('./scanner');

(async () => {
  await scanner.start();
})();
