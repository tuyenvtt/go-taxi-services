# Go-Taxi Services Backend

This repository contains all system services including: booking, promotions, user services, booking processor, ...
<br>The system uses the following technologies: nodejs, postgres, redis, socket.io, ...

And this system is under development!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation
- Postgres 14: https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/
    - Once successful installation, run the command below to connect to postgres DATABASE
    ``` psql -p 5432 -U postgres ``` 
    - After successful connection, run the SQL below to set up the DATABASE

    ``` CREATE DATABASE "gotaxi" WITH ENCODING 'UTF8'; ```
    ``` \c gotaxi postgres localhost 5432; ```
    - Copy all content from file Migration/version-1.0.0.sql and paste into command line from psql to setup DATABASE.
    - Quit and run
- Redis 7.2.3: https://redis.io/docs/install/install-redis/install-redis-on-mac-os/ 


## Usage
#### Note: Should review this configuration from config/default.json (for local env)
```
"system": {
    "database": {
        "host": "localhost",
        "port": "5432",
        "database": "gotaxi",
        "username": "postgres",
        "password": ""
    },
    "redis": {
      "host": "localhost",
      "password": "",
      "port": 6379
    }
  },
```
- Run the user management service using the command line from the existing source code
    - CMD: ``` make run-user-mangement ```
    - Read Makefile for API testing

- Run the user booking service using the command line from the existing source code
    - CMD: ``` make run-booking-service ```
    - Read Makefile for API testing

## Contributing

## License
