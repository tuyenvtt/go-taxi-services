const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const { queryParser } = require('express-query-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const authenticated = require('@library/middlewares/authen');

class Server {
  constructor () {
    this.app = express();
    this.routes = express.Router();

    this.configureMiddlewares();
    this.configureRoutes();
  }

  configureMiddlewares () {
    // Compression middleware
    this.app.use(compression());

    // Body parsing middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Query parsing middleware
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      queryParser({
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true
      })
    );

    // Helmet middleware for enhanced security
    this.app.use(helmet());

    // CORS middleware for cross-origin requests
    this.app.use(cors());

    // Cookies parser middleware
    this.app.use(cookieParser());
  }

  configureRoutes () {
    this.app.use('/', this.routes);
  }

  addRoutes (routes) {
    routes.forEach(route => {
      const { method, path, handler } = route;
      if (!method || !path || !handler) {
        throw new Error(`Invalid route: method ${method} | path ${path} | handler ${handler}!`);
      }

      if (route.access === 'private') {
        this.routes[method.toLowerCase()](path, authenticated.bind(this), handler);
      } else {
        this.routes[method.toLowerCase()](path, handler);
      }
    });
  }

  start (port) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

module.exports = Server;
