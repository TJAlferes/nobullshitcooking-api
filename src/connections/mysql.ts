import { createPool } from 'mysql2/promise';

export const commonConfig = {
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  namedPlaceholders:  true,
  timezone:           'Z',  // UTC +00:00
  dateStrings:        true
};
export const productionConfig = {
  ...commonConfig,
  host:     process.env.RDS_HOSTNAME,
  user:     process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
};
export const testConfig = {
  ...commonConfig,
  host:         process.env.TEST_MYSQL_HOST,
  user:         process.env.TEST_MYSQL_USER,
  password:     process.env.TEST_MYSQL_PASSWORD,
  database:     process.env.TEST_MYSQL_DATABASE,
  insecureAuth: true
};
export const developmentConfig = {
  ...commonConfig,
  host:         process.env.DEV_MYSQL_HOST,
  user:         process.env.DEV_MYSQL_USER,
  password:     process.env.DEV_MYSQL_PASSWORD,
  database:     process.env.DEV_MYSQL_DATABASE,
  insecureAuth: true
};

export function getConfig() {
  if (process.env.NODE_ENV === 'production') {
    return productionConfig;
  }
  if (process.env.NODE_ENV === 'test') {
    return testConfig;
  }
  return developmentConfig;
}

export const pool = createPool(getConfig());  // TO DO: set up proper retry logic
