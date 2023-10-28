const BookingStatus = {
  INVALID: 0,
  CREATING: 1,
  CREATED: 2,
  CREATE_ERROR: 3,
  PROCESSING: 4,
  CONFIRM_ARRIVAL: 5,
  CONFIRM_ARRIVAL_ERROR: 6,
  DRIVER_IN_COMMING: 7,
  DRIVER_CANCELED: 8,
  DRIVER_PICKUP: 9,
  DRIVER_DROPOFF: 10,
  CANCELED: 11,
  COMPLETE: 12
};

const BookingType = {
  INVALID: 0,
  OFFHAND: 1,
  SCHEDULED: 2
};

const BookingSource = {
  INVALID: 0,
  CUSTOMER: 1,
  CALL_CENTER: 2
};

const PaymentMethod = {
  INVALID: 0,
  CASH_ON_HAND: 1,
  BANK_ACCOUNT: 2,
  BANK_CARD: 3,
  ZALOPAY_WALLET: 4,
  MOMO_WALLET: 5
};

module.exports = {
  BookingStatus,
  BookingSource,
  BookingType,
  PaymentMethod
};
