const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('@common/database/postgres');

const Address = sequelize.define('Address', {
  address_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
    allowNull: false
  },
  gg_place_id: DataTypes.STRING,
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  formatted: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'address'
});

(async () => {
  try {
    await Address.sync();
    console.log('Succes');
  } catch (error) {
    console.error('Error', error);
  }
})();

module.exports = Address;
