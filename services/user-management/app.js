require('../../alias');

const Logger = require('@library/logger');
const Server = require('@library/server');
const { CustomerRoutes } = require('./routes');
const CustomerController = require('./controllers/customer');
const { getConfig } = require('@common/utils/config');

const server = new Server();

const logger = new Logger(getConfig('services.user.log_path'), getConfig('services.user.service_name'));
const customerController = new CustomerController(logger);
const customerRoutes = new CustomerRoutes(customerController);

server.addRoutes(customerRoutes.resolve());
server.start(8080);
