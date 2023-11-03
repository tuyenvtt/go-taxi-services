/* eslint-disable no-undef */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyOTP } = require('./verify_otp');
const { encrypt } = require('@common/utils/crypto');
const { redis } = require('@common/database/redis');
const { generateOTP } = require('@common/utils/otp');
const { getConfig } = require('@common/utils/config');
const Customer = require('@services/user-management/models/Customer');
const { OK, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require('@common/constants/codes');
const { TokenAction } = require('@common/constants/user');
const { validate } = require('@common/validator/validator');

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
    id: 'check_empty_otp',
    func: (request, errors) => {
      const { otp } = request.body;
      if (!otp || otp === '') {
        errors.push('otp is empty');
        return false;
      } else {
        return true;
      }
    }
  }
];

class LoginController {
  constructor (logger) {
    this.logger = logger;
    this.login = this.login.bind(this);
    this.verify = this.verify.bind(this);
  }

  async login (req, res) {
    const error = validate(req, validator, ['check_empty_phone']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { phone, password } = req.body;

    try {
      const customer = await Customer.findOne({
        where: { phone }
      });
      if (!customer || !customer.verified) {
        this.logger.error('[Customer][Login] phone not found ' + phone);
        res.status(error.status).json({
          error: {
            status: NOT_FOUND,
            message: 'Customer not found or not verify'
          }
        });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      if (hashedPassword !== customer.password) {
        res.status(error.status).json({
          error: {
            status: UNAUTHORIZED,
            message: 'Phone or password invalid'
          }
        });
        return;
      }

      const payload = {
        id: customer.customer_id,
        phone: customer.phone,
        eat: Date.now() + 24 * 60 * 60 * 1000
      };

      const secretKey = getConfig('common.secret.authen');
      const token = jwt.sign(payload, secretKey);

      // const otp = generateOTP();
      // const prefix = getConfig('common.redis.otp');
      // const token = encrypt(JSON.stringify({ otp, action: TokenAction.Login, created_time: Date.now() }), getConfig('common.secret.otp'));
      // await redis.set(`${prefix}${phone}`, token, 'EX', 10 * 60); // 10 minutes

      res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      res.status(OK).json({ message: "Success", token });
    } catch (error) {
      this.logger.error('[Customer][Login] error ' + error);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: {
          status: INTERNAL_SERVER_ERROR,
          message: 'Internal server error'
        }
      });
    }
  }

  async verify (req, res) {
    const error = validate(req, validator, []);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { phone, otp } = req.body;

    try {
      const customer = await Customer.findOne({
        where: { phone }
      });

      if (!customer || !customer.verified) {
        this.logger.error('[Customer][Login] phone not found ' + phone);
        const error = {
          status: NOT_FOUND,
          message: 'Customer not found'
        };
        res.status(error.status).json({ error });
        return;
      }
      this.logger.info('[Customer][Login] customer ' + customer);

      const error = await verifyOTP(phone, otp, TokenAction.Login);
      if (error) {
        res.status(error.status).json({ error });
        return;
      }

      const payload = {
        id: customer.customer_id,
        phone: customer.phone,
        eat: Date.now() + 24 * 60 * 60 * 1000
      };

      const secretKey = getConfig('common.secret.authen');
      const token = jwt.sign(payload, secretKey);

      res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      res.status(OK).json({ token });
    } catch (error) {
      this.logger.error('[Customer][Login] error ' + error);
      res.status(INTERNAL_SERVER_ERROR).json({
        error: {
          status: INTERNAL_SERVER_ERROR,
          message: 'Internal server error'
        }
      });
    }
  }
}

module.exports = LoginController;
