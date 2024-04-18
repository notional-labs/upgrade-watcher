require('dotenv').config({ path: '.env', debug: true });
const watcher = require('./watcher');

(async () => {
  await watcher.start();
})();
