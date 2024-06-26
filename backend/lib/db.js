const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH,
  logging: false,
});

const ScanStatus = sequelize.define('ScanStatus', {
  chain: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  last_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Proposal = sequelize.define('Proposal', {
  // id = {chain}_{proposal_id}
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  chain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  proposal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  voting_end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estimated_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // jsonstr: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
});

const sync = async () => {
  // Automatically create all tables
  await sequelize.sync();
}

const set_ScanStatus = async (chain, last_id) => {
  const [instance, created] = await ScanStatus.upsert({chain, last_id});
}

const get_ScanStatus = async (chain) => {
  // null if not found
  const ss = ScanStatus.findByPk(chain);
  return ss;
}

const put_Proposal = async ({id, chain, proposal_id, status, name, height, voting_end_time, estimated_time}) => {
  const [instance, created] = await Proposal.upsert({id, chain, proposal_id, status, name, height, voting_end_time, estimated_time});
}

const get_Proposal = async (id) => {
  // null if not found
  const p = Proposal.findByPk(id);
  return p;
}

module.exports = {
  sequelize,
  sync,
  ScanStatus,
  Proposal,
  set_ScanStatus,
  get_ScanStatus,
  put_Proposal,
  get_Proposal,
};
