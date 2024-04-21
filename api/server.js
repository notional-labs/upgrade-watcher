const express = require('express');

/**
 * list all incoming upgrades
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const list = async (req, res) => {
  try {
    res.send({status: "success", data: null});
  } catch (err) {
    res.send({status: "error", message: err.message});
  }
};

const start = () => {
  app = express()
  app.use(express.json({limit: '100mb'})); // for parsing application/json
  app.get('/list', list);
  app.listen(8800, () => {
    console.log(`api server listening on port 8800`)
  });
};

module.exports = {start};
