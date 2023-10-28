/* eslint-disable camelcase */
const { BookingStatus, BookingType, BookingSource } = require('@common/constants/booking');
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('@common/constants/codes');
const { validate } = require('@common/validator/validator');
const Booking = require('@services/booking-service/models/Booking');
const Address = require('@services/booking-service/models/Address');
const { PaymentMethods, FareRules, VehicleTypes } = require('@biz');
const { redis } = require('@common/database/redis');
const { Channels } = require('@common/constants/channels');

const validator = [
  {
    id: 'check_empty_phone',
    func: (request, errors) => {
      const { phone } = request.body;
      if (!phone || phone === '') {
        errors.push('phone is empty');
        return false;
      } else {
        return true;
      }
    }
  },
  {
    id: 'check_empty_token',
    func: (request, errors) => {
      const { token, password } = request.body;
      if (!token || token === '') {
        errors.push('token is empty');
        return false;
      } else if (!password || password === '') {
        errors.push('password is empty');
        return false;
      } else {
        return true;
      }
    }
  }
];

class BookingController {
  constructor (logger) {
    this.logger = logger;

    this.book = this.book.bind(this);
    this.scheduledBook = this.scheduledBook.bind(this);
    this.dispatcherBook = this.dispatcherBook.bind(this);
    this.getBookingById = this.getBookingById.bind(this);
    this.getBookingStatus = this.getBookingStatus.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
    this.confirmArrival = this.confirmArrival.bind(this);
    this.confirmReceipt = this.confirmReceipt.bind(this);
    this.confirmComplete = this.confirmComplete.bind(this);
    this.getBookingHistory = this.getBookingHistory.bind(this);
    this.getRecentBookings = this.getRecentBookings.bind(this);
    this.calculateVehiclePricing = this.calculateVehiclePricing.bind(this);
    this.getPaymentMethods = this.getPaymentMethods.bind(this);
  }

  async book (req, res) {
    const ruleIds = [
      'check_customer_id_from_session',
      'valid_pickup_address',
      'valid_destination_address',
      'valid_booking_data'
    ];
    const error = validate(req, validator, ...ruleIds);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const customer_id = req.payload.id;

    const {
      pickup_address,
      destination_address,
      num_passengers,
      trip_distance,
      trip_fare,
      discount_amount,
      total_amount,
      payment_method
    } = req.body;

    try {
      // TODO: before book we have to check the last booking state is the final or not

      const pickupAddrData = {
        gg_place_id: pickup_address.gg_place_id,
        latitude: pickup_address.latitude,
        longitude: pickup_address.longitude,
        formatted: pickup_address.formatted
      };

      const pickupAddr = await Address.create(pickupAddrData);
      if (!pickupAddr) {
        const error = {
          status: INTERNAL_SERVER_ERROR,
          message: 'Create address failed'
        };
        res.status(error.status).json(error);
        return;
      }

      const destinationAddrData = {
        gg_place_id: destination_address.gg_place_id,
        latitude: destination_address.latitude,
        longitude: destination_address.longitude,
        formatted: destination_address.formatted
      };

      const destinationAddr = await Address.create(destinationAddrData);
      if (!destinationAddr) {
        const error = {
          status: INTERNAL_SERVER_ERROR,
          message: 'Create address failed'
        };
        res.status(error.status).json(error);
        return;
      }

      const booking = {
        customer_id,
        pickup_address_id: pickupAddr.address_id,
        destination_address_id: destinationAddr.address_id,
        num_passengers,
        trip_distance,
        trip_fare,
        discount_amount,
        total_amount,
        payment_method,
        booking_status: BookingStatus.CREATED,
        booking_type: BookingType.OFFHAND,
        booking_source: BookingSource.CUSTOMER
      };

      const bookingCreated = await Booking.create(booking);
      if (!bookingCreated) {
        const error = {
          status: INTERNAL_SERVER_ERROR,
          message: 'Create booking failed'
        };
        res.status(error.status).json(error);
        return;
      }

      redis.publish(Channels.NewBooking, JSON.stringify(bookingCreated));

      res.status(200).json(bookingCreated);
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async scheduledBook (req, res) {
    const error = validate(req, validator, ['must_be_change']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    try {
      //
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async dispatcherBook (req, res) {
    const error = validate(req, validator, ['must_be_change']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    // const { phone } = req.body;

    try { /* empty */ } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async getBookingById (req, res) {
    const error = validate(req, validator, ['check_empty_booking_uuid']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { booking_uuid } = req.query;

    try {
      const booking = Booking.findOne({
        where: { booking_uuid }
      });
      if (!booking) {
        const error = {
          status: NOT_FOUND,
          message: 'Booking not found'
        };
        res.status(error.status).json(error);
        return;
      }

      // TODO: resolve address

      res.status(200).json({ booking }); // filter redundant fields
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async getBookingStatus (req, res) {
    const error = validate(req, validator, ['check_empty_booking_uuid']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { booking_uuid } = req.query;

    try {
      const booking = Booking.findOne({
        where: { booking_uuid }
      });
      if (!booking) {
        const error = {
          status: NOT_FOUND,
          message: 'Booking not found'
        };
        res.status(error.status).json(error);
        return;
      }

      res.status(200).json({ status: booking.booking_status }); // filter redundant fields
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async cancelBooking (req, res) {
    const error = validate(req, validator, ['check_empty_booking_uuid_from_body']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { booking_uuid } = req.body;

    try {
      const booking = Booking.findOne({
        where: { booking_uuid }
      });
      if (!booking) {
        const error = {
          status: NOT_FOUND,
          message: 'Booking not found'
        };
        res.status(error.status).json(error);
        return;
      }

      const updated = await booking.update({ booking_status: BookingStatus.CANCELED });
      if (!updated) {
        const error = {
          status: INTERNAL_SERVER_ERROR,
          message: 'Booking update failed'
        };
        res.status(error.status).json(error);
        return;
      }

      res.status(200).json({ message: 'Success' });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async confirmArrival (req, res) {
    const error = validate(req, validator, ['check_empty_booking_uuid_from_body']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { booking_uuid } = req.body;

    try {
      const booking = Booking.findOne({
        where: { booking_uuid }
      });
      if (!booking) {
        const error = {
          status: NOT_FOUND,
          message: 'Booking not found'
        };
        res.status(error.status).json(error);
        return;
      }

      const updated = await booking.update({ booking_status: BookingStatus.CONFIRM_ARRIVAL });
      if (!updated) {
        const error = {
          status: INTERNAL_SERVER_ERROR,
          message: 'Booking update failed'
        };
        res.status(error.status).json(error);
        return;
      }

      // TODO: send to user

      res.status(200).json({ message: 'Success' });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async confirmReceipt (req, res) {
    const error = validate(req, validator, ['check_empty_booking_uuid_from_body']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { booking_uuid } = req.body;

    try {
      const booking = Booking.findOne({
        where: { booking_uuid }
      });
      if (!booking) {
        const error = {
          status: NOT_FOUND,
          message: 'Booking not found'
        };
        res.status(error.status).json(error);
        return;
      }

      const updated = await booking.update({
        booking_status: BookingStatus.DRIVER_PICKUP,
        pickup_time: new Date().getTime()
      });
      if (!updated) {
        const error = {
          status: INTERNAL_SERVER_ERROR,
          message: 'Booking update failed'
        };
        res.status(error.status).json(error);
        return;
      }

      // TODO: send to user

      res.status(200).json({ message: 'Success' });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async confirmComplete (req, res) {
    const error = validate(req, validator, ['check_empty_booking_uuid_from_body']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { booking_uuid } = req.body;

    try {
      const booking = Booking.findOne({
        where: { booking_uuid }
      });
      if (!booking) {
        const error = {
          status: NOT_FOUND,
          message: 'Booking not found'
        };
        res.status(error.status).json(error);
        return;
      }

      const updated = await booking.update({
        booking_status: BookingStatus.DRIVER_DROPOFF,
        dropoff_time: new Date().getTime()
      });
      if (!updated) {
        const error = {
          status: INTERNAL_SERVER_ERROR,
          message: 'Booking update failed'
        };
        res.status(error.status).json(error);
        return;
      }

      // TODO: send to user

      res.status(200).json({ message: 'Success' });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async getBookingHistory (req, res) {
    const ruleIds = [
      'check_customer_id_from_session',
      'check_invalid_page_and_limit'
    ];
    const error = validate(req, validator, ruleIds);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const customer_id = req.payload.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const history = await Booking.findAll({
        where: {
          customer_id
        },
        offset: (page - 1) * limit,
        limit
      });
      if (!history || history.length === 0) {
        const error = {
          status: NOT_FOUND,
          message: 'History not found'
        };
        res.status(error.status).json({ error });
      };

      // TODO: resolve address

      res.status(200).json({ history });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async getRecentBookings (req, res) {
    const error = validate(req, validator, ['check_customer_id_from_session']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const customer_id = req.payload.id;

    try {
      const bookings = await Booking.findAll({
        where: {
          customer_id
        },
        order: [['created_at', 'DESC']],
        limit: 5 // limit to 5 booking
      });
      if (!bookings || bookings.length === 0) {
        const error = {
          status: NOT_FOUND,
          message: 'Bookings not found'
        };
        res.status(error.status).json({ error });
      };

      // TODO: resolve address

      res.status(200).json({ bookings });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async calculateVehiclePricing (req, res) {
    const error = validate(req, validator, ['validate_trip_distance_must_be_float']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { trip_distance } = req.query;

    try {
      const calculate = (tripDistance, vehicleType, weatherCondition) => {
        // Get pricing rules for the given vehicle type
        const vehiclePricingRules = FareRules[vehicleType];
        if (!vehiclePricingRules) {
          return new Error('Invalid vehicle type');
        }

        // Extract pricing factors for the vehicle type
        const { baseFare, distanceRate, timeRate, weatherSurcharges } = vehiclePricingRules;

        // Calculate distance-based fare
        const distanceFare = distanceRate * tripDistance;

        // Calculate time-based fare based on time range
        const now = new Date();
        const currentHour = now.getHours();
        let timeFare = 1;
        let matchingRate = null;
        for (const rate of timeRate) {
          if ((currentHour >= rate.start && currentHour < rate.end) || (rate.start > rate.end && (currentHour >= rate.start || currentHour < rate.end))) {
            matchingRate = rate;
            break;
          }
        }
        if (matchingRate) {
          timeFare = matchingRate.rate;
        }

        // Apply weather surcharges
        const weatherSurcharge = weatherSurcharges[weatherCondition.toLowerCase()] || 0;

        // Calculate total fare
        const totalFare = (baseFare + distanceFare + weatherSurcharge) * timeFare;

        return {
          baseFare,
          distanceFare,
          timeFare,
          weatherSurcharge,
          totalFare
        };
      };

      const pricing = [];
      for (const vehicle of VehicleTypes) {
        if (!vehicle.active) {
          continue;
        }
        const fare = calculate(trip_distance, vehicle.type, 'sunny'); // TODO: hardcode weather
        if (fare instanceof Error) {
          continue;
        }
        pricing.push({ vehicle, fare });
      }

      res.status(200).json({ pricing });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async getPaymentMethods (req, res) {
    const error = validate(req, validator, []);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    try {
      res.status(200).json({ methods: PaymentMethods });
    } catch (err) {
      this.logger.error('[Booking] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }
};

module.exports = { BookingController };
