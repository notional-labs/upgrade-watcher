require('dotenv').config({ path: '.env', debug: true });

const {start} = require('./tracker.js');

(async () => {
  const chain = "dymension";
  await start(chain);
})();
