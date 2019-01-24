import { Pool } from 'pg';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Remove all Users
 */
const removeAllUsers = () => {
  const query = 'DELETE FROM users';
  pool.connect((er, client, done) => {
    if (er) throw er;
    client.query(query, (err, res) => {
      done();
      if (err) {
        console.log(err);
      }
    });
  });
};

/**
 * Remove all Users
 */
const removeAllMeetups = () => {
  const query = 'DELETE FROM meetups';
  pool.connect((er, client, done) => {
    if (er) throw er;
    client.query(query, (err, res) => {
      done();
      if (err) {
        console.log(err);
      }
    });
  });
};

/**
 * Remove all Users
 */
const removeAllRsvps = () => {
  const query = 'DELETE FROM rsvps';
  pool.connect((er, client, done) => {
    if (er) throw er;
    client.query(query, (err, res) => {
      done();
      if (err) {
        console.log(err);
      }
    });
  });
};

/**
 * Add User
 */
const addUser = () => {
  const query = 'INSERT INTO users(firstname, lastname, othername, email, phone_number, username,password, registered) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
  const values = ['Pacifique', 'Ndayisenga', 'Clement', 'pacifiqueclement@gmail.com', '0781983488', 'Paccy10', '$2a$10$9ErZa7Rw/OPHp1mLllOi1uK/3omWtjaagg.fZyquC3i11rn0WoKZ.', moment(new Date())];
  pool.connect((er, client, done) => {
    if (er) throw er;
    client.query(query, values, (err, res) => {
      done();
      if (err) {
        console.log(err);
      }
    });
  });
};

/**
 * Add Meetup
 */
const addMeetup = () => {
  const query = 'INSERT INTO meetups(created_on, location, images, topic, happening_on, tags) VALUES($1, $2, $3, $4, $5, $6)';
  const values = [moment(new Date()), 'Kigali Serena Hotel', ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'], 'Node JS', '2019-02-20', ['Programming', 'Javascript']];
  pool.connect((er, client, done) => {
    if (er) throw er;
    client.query(query, values, (err, res) => {
      done();
      if (err) {
        console.log(err);
      }
    });
  });
};

export default {
  removeAllUsers,
  removeAllMeetups,
  removeAllRsvps,
  addUser,
  addMeetup,
};
