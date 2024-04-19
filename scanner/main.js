require('dotenv').config({ path: '.env', debug: true });

const {start} = require('./scanner.js');

(async () => {
  const chain = "quicksilver";
  await start(chain);
})();
