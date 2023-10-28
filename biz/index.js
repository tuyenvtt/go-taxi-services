// TODO: move to database and build admin config tools
module.exports = {
  PaymentMethods: [
    {
      type: 'CASH_ON_HAND',
      name: 'Tiền mặt',
      active: true
    },
    {
      type: 'BANK_ACCOUNT',
      name: 'Tài khoản ngân hàng',
      active: true
    },
    {
      type: 'BANK_CARD',
      name: 'Thẻ ngân hàng',
      active: true
    },
    {
      type: 'ZALOPAY_WALLET',
      name: 'Ví ZaloPay',
      active: true
    },
    {
      type: 'MOMO_WALLET',
      name: 'Ví MoMo',
      active: true
    }
  ],
  VehicleTypes: [
    {
      type: 'MOTOBIKE',
      name: 'Xe Máy',
      active: true
    },
    {
      type: 'MOTOBIKE_PLUS',
      name: 'Xe Máy Tốt',
      active: true
    },
    {
      type: 'COMPACT_CAR',
      name: 'Ô tô 4 chỗ',
      active: true
    },
    {
      type: 'STYLISH_CAR',
      name: 'Ô tô 7 chỗ',
      active: true
    }
  ],
  FareRules: {
    MOTOBIKE: {
      baseFare: 10000,
      distanceRate: 5000,
      timeRate: [
        { start: 6, end: 11, rate: 1 },
        { start: 11, end: 13, rate: 1.1 },
        { start: 13, end: 17, rate: 1 },
        { start: 17, end: 20, rate: 1.1 },
        { start: 20, end: 24, rate: 1.12 },
        { start: 0, end: 6, rate: 1.2 }
      ],
      currency: 'VND',
      weatherSurcharges: {
        rain: 1,
        snow: 2,
        sunny: 0
      }
    },
    MOTOBIKE_PLUS: {
      baseFare: 10000,
      distanceRate: 6000,
      timeRate: [
        { start: 6, end: 11, rate: 1 },
        { start: 11, end: 13, rate: 1.1 },
        { start: 13, end: 17, rate: 1 },
        { start: 17, end: 20, rate: 1.1 },
        { start: 20, end: 24, rate: 1.12 },
        { start: 0, end: 6, rate: 1.2 }
      ],
      currency: 'VND',
      weatherSurcharges: {
        rain: 1,
        snow: 2,
        sunny: 0
      }
    },
    COMPACT_CAR: {
      baseFare: 15000,
      distanceRate: 11000,
      timeRate: [
        { start: 6, end: 11, rate: 1 },
        { start: 11, end: 13, rate: 1.1 },
        { start: 13, end: 17, rate: 1 },
        { start: 17, end: 20, rate: 1.1 },
        { start: 20, end: 24, rate: 1.12 },
        { start: 0, end: 6, rate: 1.2 }
      ],
      currency: 'VND',
      weatherSurcharges: {
        rain: 2,
        snow: 3,
        sunny: 0
      }
    },
    STYLISH_CAR: {
      baseFare: 20000,
      distanceRate: 15000,
      timeRate: [
        { start: 6, end: 11, rate: 1 },
        { start: 11, end: 13, rate: 1.1 },
        { start: 13, end: 17, rate: 1 },
        { start: 17, end: 20, rate: 1.1 },
        { start: 20, end: 24, rate: 1.12 },
        { start: 0, end: 6, rate: 1.2 }
      ],
      currency: 'VND',
      weatherSurcharges: {
        rain: 2.5,
        snow: 3.5,
        sunny: 0
      }
    }
    // Add more vehicle types and their respective pricing rules as needed
  }
};
