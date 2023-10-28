/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const Customer = require('@services/user-management/models/Customer');
const { OK, INVALID_PAYLOAD, INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN } = require('@common/constants/codes');
const { encrypt, decrypt } = require('@common/utils/crypto');
const { getConfig } = require('@common/utils/config');
const { redis } = require('@common/database/redis');
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

class AccountController {
  constructor (logger) {
    this.logger = logger;
    this.resetPassword = this.resetPassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  async resetPassword (req, res) {
    const error = validate(req, validator, ['check_empty_phone']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { phone } = req.body;

    try {
      const customer = await Customer.findOne({
        where: { phone }
      });
      if (!customer || !customer.verified) {
        const error = {
          status: NOT_FOUND,
          message: 'Customer not found or not register'
        };
        res.status(error.status).json({ error });
        return;
      }

      const token = encrypt(JSON.stringify({ phone, created_time: Date.now() }), getConfig('common.secret.password'));
      const prefix = getConfig('common.redis.reset_password');
      await redis.set(`${prefix}${phone}`, JSON.stringify({ token, phone }), 'EX', 10 * 60); // 10 minutes

      const url = `${getConfig('base.url')}/pages/update-password?token=${token}`;

      // TODO: implement send otp to phone or mail here
      res.status(OK).json({ url, note: 'temporary return' }); // TODO: temporary return to response, user only receives link reset password from phone or mail
    } catch (err) {
      this.logger.error('[Customer][Account] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }

  async updatePassword (req, res) {
    const error = validate(req, validator, ['check_empty_token']);
    if (error) {
      res.status(error.status).json({ error });
      return;
    }

    const { token, password } = req.body;

    try {
      // Verify token
      const tokenStr = decrypt(token, getConfig('common.secret.password'));
      const tokenData = JSON.parse(tokenStr);
      if (!tokenData || !tokenData.phone) {
        const error = {
          status: INVALID_PAYLOAD,
          message: 'Token invalid'
        };
        res.status(error.status).json({ error });
        return;
      }

      const prefix = getConfig('common.redis.reset_password');
      const validTokenStr = await redis.get(`${prefix}${tokenData.phone}`);
      const validTokenData = JSON.parse(validTokenStr);
      if (!validTokenData || !validTokenData.token) {
        const error = {
          status: INVALID_PAYLOAD,
          message: 'Token expired'
        };
        res.status(error.status).json({ error });
        return;
      }

      if (token !== validTokenData.token) {
        const error = {
          status: INVALID_PAYLOAD,
          message: 'Token invalid'
        };
        res.status(error.status).json({ error });
        return;
      }

      // Verify user
      const customer = await Customer.findOne({
        where: { phone: validTokenData.phone }
      });
      if (!customer || !customer.verified) {
        const error = {
          status: NOT_FOUND,
          message: 'Customer not found or not register'
        };
        res.status(error.status).json({ error });
        return;
      }

      // Update password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const updated = await Customer.update(
        { password: hash },
        { where: { customer_id: customer.customer_id } }
      );
      if (!updated) {
        const error = {
          status: FORBIDDEN,
          message: 'Update password failed'
        };
        res.status(error.status).json({ error });
        return;
      }

      await redis.del(`${prefix}${validTokenData.phone}`);
      res.status(OK).json({ customer_id: customer.customer_id });
    } catch (err) {
      this.logger.error('[Customer][Account] error ' + err);
      const error = {
        status: INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: err
      };
      res.status(error.status).json({ error });
    }
  }
}

module.exports = AccountController;
