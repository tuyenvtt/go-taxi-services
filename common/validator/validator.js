const { INVALID_PAYLOAD } = require('@common/constants/codes');

function validate (req, validator, ...ids) {
  const errors = [];
  for (const rule of validator) {
    if (ids.length === 0 || ids.includes(rule.id)) {
      rule.func(req, errors);
    }
  }

  if (errors.length > 0) {
    const error = {
      status: INVALID_PAYLOAD,
      message: 'Invalid request',
      details: errors
    };
    return error;
  }

  return null;
};

module.exports.validate = validate;
