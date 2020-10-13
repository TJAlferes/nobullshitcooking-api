'use strict';

import mysql from 'mysql2/promise';

export const pool = process.env.NODE_ENV === 'production'
  ? mysql.createPool({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    waitForConnections: Boolean(process.env.DB_WAIT_FOR_CONNECTIONS),
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
    queueLimit: Number(process.env.DB_QUEUE_LIMIT)
  })
  : process.env.NODE_ENV === 'test'
    ? mysql.createPool({
      host: process.env.TEST_MYSQL_HOST,
      user: process.env.TEST_MYSQL_USER,
      password: process.env.TEST_MYSQL_PASSWORD,
      database: process.env.TEST_MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      insecureAuth: true
    })
    : mysql.createPool({
      host: process.env.DEV_MYSQL_HOST,
      user: process.env.DEV_MYSQL_USER,
      password: process.env.DEV_MYSQL_PASSWORD,
      database: process.env.DEV_MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      insecureAuth: true
    });

// set up proper retry logic