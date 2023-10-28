/* eslint-disable n/no-path-concat */
const moduleAlias = require('module-alias');
moduleAlias.addAliases({
  '@biz': __dirname + '/biz',
  '@common': __dirname + '/common',
  '@library': __dirname + '/library',
  '@services': __dirname + '/services'
});
