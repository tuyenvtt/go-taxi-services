function isProductionMode () {
  return process.env.NODE_ENV === 'production';
}

module.exports = exports = {};
exports.isProductionMode = isProductionMode;
