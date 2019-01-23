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
const createTables = () => {
  const queries = [];
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
  queries.push(usersQuery);

  const meetupsQuery = `CREATE TABLE IF NOT EXISTS
                      meetups(
                        id SERIAL NOT NULL PRIMARY KEY,
                        created_on TIMESTAMP NOT NULL,
                        location VARCHAR(200) NOT NULL,
                        images VARCHAR [],
                        topic VARCHAR(200) NOT NULL,
                        happening_on DATE NOT NULL,
                        tags VARCHAR []
                      )`;
  queries.push(meetupsQuery);

  for (let i = 0; i < queries.length; i++) {
    pool.query(queries[i])
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }
};

/**
 * Drop Tables
 */
const dropTables = () => {
  const queries = [];
  const usersQuery = 'DROP TABLE IF EXISTS users';
  queries.push(usersQuery);

  const meetupsQuery = 'DROP TABLE IF EXISTS meetups';
  queries.push(meetupsQuery);

  for (let i = 0; i < queries.length; i++) {
    pool.query(queries[i])
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }
};


pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
