const { getConfig } = require('@common/utils/config');
const Redis = require('ioredis');

const redis = new Redis({
  host: getConfig('system.redis.host'),
  port: getConfig('system.redis.port'),
  password: getConfig('system.redis.password')
});

module.exports.redis = redis;
