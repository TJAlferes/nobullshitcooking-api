import { createPool } from 'mysql2/promise';

export const pool = createPool(getConfigOptions());  // TO DO: set up proper retry logic

export function getConfigOptions() {
  if (process.env.NODE_ENV === 'production') {
    return productionConfigOptions;
  }
  if (process.env.NODE_ENV === 'test') {
    return testConfigOptions;
  }
  return developmentConfigOptions;
}

const productionConfigOptions = {
  host:               process.env.RDS_HOSTNAME,
  user:               process.env.RDS_USERNAME,
  password:           process.env.RDS_PASSWORD,
  database:           process.env.RDS_DB_NAME,
  waitForConnections: Boolean(process.env.DB_WAIT_FOR_CONNECTIONS),
  connectionLimit:    Number(process.env.DB_CONNECTION_LIMIT),
  queueLimit:         Number(process.env.DB_QUEUE_LIMIT),
  namedPlaceholders:  true,
};
const testConfigOptions = {
  host:               process.env.TEST_MYSQL_HOST,
  user:               process.env.TEST_MYSQL_USER,
  password:           process.env.TEST_MYSQL_PASSWORD,
  database:           process.env.TEST_MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  namedPlaceholders:  true,
  insecureAuth:       true,
};
const developmentConfigOptions = {
  host:               process.env.DEV_MYSQL_HOST,
  user:               process.env.DEV_MYSQL_USER,
  password:           process.env.DEV_MYSQL_PASSWORD,
  database:           process.env.DEV_MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  namedPlaceholders:  true,
  insecureAuth:       true,
};
