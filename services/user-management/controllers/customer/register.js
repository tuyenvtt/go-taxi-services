/* eslint-disable no-undef */
/* eslint-disable camelcase */
const { verifyOTP } = require('./verify_otp');
const { redis } = require('@common/database/redis');
const { encrypt } = require('@common/utils/crypto');
const { generateOTP } = require('@common/utils/otp');
const { getConfig } = require('@common/utils/config');
const { TokenAction } = require('@common/constants/user');
const Customer = require('@services/user-management/models/Customer');
const { OK, INVALID_PAYLOAD, INTERNAL_SERVER_ERROR } = require('@common/constants/codes');
const { validate } = require('@common/validator/validator');

const validator = [
  {
    id: 'check_empty_info',
    func: (request, errors) => {
      const { full_name, email, phone } = request.body;
      if (!full_name || full_name === '') {
        errors.push('full_name is empty');
        return false;
      } else if (!email || email === '') {
        errors.push('email is empty');
        return false;
      } else if (!phone || phone === '') {
        errors.push('phone is empty');
        return false;
      } else {
        return true;
      }
    }
  },
  {
    id: 'check_empty_otp',
    func: (request, errors) => {
      const { phone, otp } = request.body;
      if (!otp || otp === '') {
        errors.push('otp is empty');
        return false;
      } else if (!phone || phone === '') {
        errors.push('phone is empty');
        return false;
      } else {
        return true;
      }
    }
  }
];

class RegisterController {
  constructor (logger) {
    this.logger = logger;
    this.register = this.register.bind(this);
    this.verify = this.verify.bind(this);
  }

  async register (req, res) {
    const error = validate(req, validator, ['check_empty_info']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { full_name, email, phone } = req.body;

    try {
      // TODO: try catch all block code call to db
      const [customer, created] = await Customer.findOrCreate({
        where: { phone },
        defaults: { full_name, email, phone }
      });
      if (!created) {
        if (customer.verified) {
          const error = {
            status: INVALID_PAYLOAD,
            message: 'Phone is registered'
          };
          res.status(error.status).json({ error });
          return;
        } else {
          await customer.update();
        }
      }

      const otp = generateOTP();
      const prefix = getConfig('common.redis.otp');
      const token = encrypt(JSON.stringify({ otp, action: TokenAction.Register, created_time: Date.now() }), getConfig('common.secret.otp'));
      await redis.set(`${prefix}${phone}`, token, 'EX', 10 * 60); // 10 minutes

      // TODO: implement send otp to phone or mail here
      res.status(OK).json({ otp, note: 'temporary return' }); // TODO: temporary return to response, user only receives otp from phone or mail
    } catch (err) {
      this.logger.error('[Customer][Register] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
        // details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async verify (req, res) {
    const error = validate(req, validator, ['check_empty_otp']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { phone, otp } = req.body;

    try {
      const customer = await Customer.findOne({
        where: { phone }
      });
      if (customer.verified) {
        const error = {
          status: INVALID_PAYLOAD,
          message: 'Phone is registered'
        };
        res.status(error.status).json({ error });
        return;
      }

      const error = await verifyOTP(phone, otp, TokenAction.Register);
      if (error) {
        res.status(error.status).json({ error });
        return;
      }

      const updated = await Customer.update(
        { verified: true },
        { where: { customer_id: customer.customer_id } }
      );
      if (!updated) {
        const error = {
          status: FORBIDDEN,
          message: 'Register failed'
        };
        res.status(error.status).json({ error });
        return;
      }

      res.status(OK).json({ customer_id: customer.customer_id });
    } catch (err) {
      this.logger.error('[Customer][Register] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }
}

module.exports = RegisterController;
