const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connect = async () => await pool.connect();

/**
 * Create Tables
 */
const createTables = async () => {
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
  const rsvpsQuery = `CREATE TABLE IF NOT EXISTS
                      rsvps(
                        id SERIAL NOT NULL PRIMARY KEY,
                        meetup_id INTEGER NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        response VARCHAR(50)
                      )`;
  const questionsQuery = `CREATE TABLE IF NOT EXISTS
                      questions(
                        id SERIAL NOT NULL PRIMARY KEY,
                        created_on TIMESTAMP NOT NULL,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        meetup_id INTEGER NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
                        title VARCHAR(200) NOT NULL,
                        body TEXT NOT NULL,
                        upvotes INTEGER NOT NULL DEFAULT 0,
                        downvotes INTEGER NOT NULL DEFAULT 0
                      )`;
  const upvotesQuery = `CREATE TABLE IF NOT EXISTS
                      upvotes(
                        id SERIAL NOT NULL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE
                      )`;
  const downvotesQuery = `CREATE TABLE IF NOT EXISTS
                      downvotes(
                        id SERIAL NOT NULL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE
                      )`;
  const commentsQuery = `CREATE TABLE IF NOT EXISTS
                      comments(
                        id SERIAL NOT NULL PRIMARY KEY,
                        question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                        comment TEXT NOT NULL
                      )`;                    

  const connection = await connect();
  await connection.query(usersQuery);
  await connection.query(meetupsQuery);
  await connection.query(rsvpsQuery);
  await connection.query(questionsQuery);
  await connection.query(upvotesQuery);
  await connection.query(downvotesQuery);
  await connection.query(commentsQuery);
  console.log('All Tables created');
  connection.release();
};

/**
 * Drop Tables
 */
const dropTables = async () => {
  const dropAlltables = 'DROP TABLE IF EXISTS users, meetups, rsvps, questions, upvotes, downvotes, comments  CASCADE';

  const connection = await connect();
  await connection.query(dropAlltables);

  console.log('All Tables droped');
  connection.release();
};

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
