const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
const createTable = () => {
  const usersQuery = `CREATE TABLE IF NOT EXISTS
                      users(
                        id SERIAL NOT NULL PRIMARY KEY,
                        firstname VARCHAR(200) NOT NULL,
                        lastname VARCHAR(200) NOT NULL,
                        othername VARCHAR(200),
                        email VARCHAR(200) NOT NULL UNIQUE,
                        phone_number VARCHAR(200) NOT NULL,
                        username VARCHAR(200) UNIQUE NOT NULL,
                        password VARCHAR(200) NOT NULL,
                        registered TIMESTAMP NOT NULL,
                        is_admin BOOLEAN NOT NULL DEFAULT false
                      )`;

  pool.query(usersQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop Tables
 */
const dropTable = () => {
  const usersQuery = 'DROP TABLE IF EXISTS users';
  pool.query(usersQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createTable,
  dropTable,
};

require('make-runnable');
