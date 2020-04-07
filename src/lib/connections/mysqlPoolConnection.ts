import mysql from 'mysql2/promise';

export const pool = process.env.NODE_ENV === 'production'
? mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT
})
: mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT,
  insecureAuth: true
});

//console.log('========== mysql2/promise createPool ========== ');
//console.log('pool', pool);
//console.log('============================== ');
// set up proper retry logic