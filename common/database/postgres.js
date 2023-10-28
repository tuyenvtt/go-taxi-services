const { Sequelize } = require('sequelize');
const { getConfig } = require('@common/utils/config');

// Create a Sequelize instance with the database credentials
const sequelize = new Sequelize(
  {
    dialect: 'postgres',
    host: getConfig('system.database.host'),
    username: getConfig('system.database.username'),
    password: getConfig('system.database.password'),
    database: getConfig('system.database.database')
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database authenticate success');
  } catch (error) {
    console.error('Database authenticate error', error);
  }
})();

module.exports.sequelize = sequelize;
