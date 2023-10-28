require('../../alias');

const Logger = require('@library/logger');
const Server = require('@library/server');
const { BookingRoutes } = require('./routes');
const { BookingController } = require('./controllers');
const { getConfig } = require('@common/utils/config');

const server = new Server();

const logger = new Logger(getConfig('services.booking.log_path'), getConfig('services.booking.service_name'));
const bookingController = new BookingController(logger);
const bookingRoutes = new BookingRoutes(bookingController);

server.addRoutes(bookingRoutes.resolve());
server.start(8081);
