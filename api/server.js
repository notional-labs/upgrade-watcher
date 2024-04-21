const { Proposal } = require('../lib/db.js');
const express = require('express');

/**
 * list all incoming upgrades
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const list = async (req, res) => {
  try {
    const proposals = await Proposal.findAll();
    res.send({status: "success", data: proposals});
  } catch (err) {
    res.send({status: "error", message: err.message});
  }
};

const start = () => {
  const app = express()
  app.use(express.json({limit: '100mb'})); // for parsing application/json
  app.get('/list', list);
  app.listen(8800, () => {
    console.log(`api server listening on port 8800`)
  });
};

module.exports = {start};
