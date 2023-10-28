const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('@common/database/postgres');

const Booking = sequelize.define('Booking', {
  booking_id: {
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
  customer_id: DataTypes.INTEGER,
  driver_id: DataTypes.INTEGER,
  call_center_id: DataTypes.INTEGER,
  pickup_address_id: DataTypes.INTEGER,
  destination_address_id: DataTypes.INTEGER,
  num_passengers: DataTypes.INTEGER,
  voucher_code: DataTypes.STRING,
  coupon_code: DataTypes.STRING,
  trip_distance: DataTypes.FLOAT,
  trip_fare: DataTypes.DECIMAL(12, 4),
  discount_amount: DataTypes.DECIMAL(12, 4),
  total_amount: DataTypes.DECIMAL(12, 4),
  pickup_time: DataTypes.DATE,
  dropoff_time: DataTypes.DATE,
  scheduled_time: DataTypes.DATE,
  cancel_time: DataTypes.DATE,
  trip_vehicle_type: DataTypes.STRING,
  payment_info_id: DataTypes.STRING,
  booking_type: DataTypes.SMALLINT,
  booking_status: DataTypes.SMALLINT,
  payment_method: DataTypes.SMALLINT,
  booking_source: DataTypes.SMALLINT,
  trip_rating: DataTypes.SMALLINT,
  trip_comment: DataTypes.STRING,
  tip_amount: DataTypes.DECIMAL(12, 4),
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'booking'
});

(async () => {
  try {
    await Booking.sync();
    console.log('Succes');
  } catch (error) {
    console.error('Error', error);
  }
})();

module.exports = Booking;
