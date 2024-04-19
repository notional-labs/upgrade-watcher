const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
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

module.exports = {
  sequelize,
  sync,
  ScanStatus,
  set_ScanStatus,
  get_ScanStatus,
};
