const { DataTypes } = require('sequelize');
const { sequelize } = require('@common/database/postgres');

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  full_name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  verified: DataTypes.BOOLEAN,
  avatar: DataTypes.STRING,
  dob: DataTypes.DATEONLY,
  account_status: DataTypes.SMALLINT,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'customer'
});

(async () => {
  try {
    await Customer.sync();
    console.log('Succes');
  } catch (error) {
    console.error('Error', error);
  }
})();

module.exports = Customer;
