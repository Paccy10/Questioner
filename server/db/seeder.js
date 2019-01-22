const { Pool } = require('pg');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
      } else {
        console.log('New user is inserted.');
      }
    });
  });
};

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
      } else {
        console.log('All Users are removed from the table.');
      }
    });
  });
};

module.exports = {
  addUser,
  removeAllUsers,
};
