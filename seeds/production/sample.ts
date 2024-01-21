import { createPool } from 'mysql2/promise';
import type { PoolOptions } from 'mysql2/promise';

const commonConfig = {
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  namedPlaceholders:  true,
  timezone:           'Z',  // UTC +00:00
  dateStrings:        true,
};
const productionConfig: PoolOptions = {
  ...commonConfig,
  host:     process.env.RDS_HOSTNAME,
  user:     process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  //database: process.env.RDS_DB_NAME,
  insecureAuth: true,  //
  port: 3306,
  ssl: {
    
  }
};

async function testMySQLConnection() {
  const pool = createPool(productionConfig);
  let connection;
  try {
    connection = await pool.getConnection();
    console.log(connection);
    await connection.ping();
    console.log('MySQL Connection success.');
    connection.release();
  } catch (error: any) {
    console.error('MySQL Connection error: ', error);
    if (connection) connection.release();
  }
}

testMySQLConnection();
