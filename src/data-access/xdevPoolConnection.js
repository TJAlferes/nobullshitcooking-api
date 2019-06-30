'use strict';

const mysqlx = require('@mysql/xdevapi');

const xdevpool = process.env.NODE_ENV === 'production'
? mysqlx.getClient({
  host: process.env.RDS_HOSTNAME,
  port: 33060,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  schema: process.env.RDS_DB_NAME
}, {
  pooling: {
    enabled: true,
    maxSize: 10,
    maxIdleTime: 1000,
    queueTimeout: 2000
  }
})
: mysqlx.getClient({
  host: process.env.DB_HOST,
  port: 33060,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_DATABASE
}, {
  pooling: {
    enabled: true,
    maxSize: 10,
    maxIdleTime: 1000,
    queueTimeout: 2000
  }
});

module.exports = xdevpool;