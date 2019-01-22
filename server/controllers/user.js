import moment from 'moment';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import validateUserSignup from '../helpers/validateUserSignup';
import validateUserLogin from '../helpers/validateUserLogin';


dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class User {
  create(req, res) {
    const user = {
      firstname: req.body.firstname.trim().replace(/\s+/g, ' '),
      lastname: req.body.lastname.trim().replace(/\s+/g, ' '),
      othername: req.body.othername.trim().replace(/\s+/g, ' '),
      email: req.body.email.trim().replace(/\s+/g, ''),
      phone_number: req.body.phone_number.trim(),
      username: req.body.username.trim().replace(/\s+/g, ' '),
      password: req.body.password.trim().replace(/\s+/g, ' '),
      registered: moment(new Date()),
    };

    const { error } = validateUserSignup(user);
    if (error) {
      res.json({ status: 404, error: error.details[0].message });
    } else {
      if (/(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/.test(user.phone_number) == false) {
        res.json({ status: 404, error: 'Invalid Phone number. It must look like (+250780000000 or 0780000000)' });
      } else {
        bcrypt.hash(user.password, 10, function (err, hash) {
          if (err) {
            res.json({ status: 404, error: err });
          } else {
            const query = 'INSERT INTO users(firstname, lastname, othername, email, phone_number, username,password, registered) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
            const values = [user.firstname, user.lastname, user.othername, user.email, user.phone_number, user.username, hash, user.registered];
            pool.connect((er, client, done) => {
              if (er) throw er;
              client.query(query, values, (e, r) => {
                done();
                if (e) {
                  res.json({ status: 404, error: e.detail });
                } else {
                  res.json({ status: 202, data: r.rows });
                }
              });
            });
          }
        });
      }
    }
  }

  getOne(req, res) {
    const user = {
      username: req.body.username.trim().replace(/\s+/g, ' '),
      password: req.body.password.trim().replace(/\s+/g, ' '),
    };

    const { error } = validateUserLogin(user);
    if (error) {
      res.json({ status: 404, error: error.details[0].message });
    } else {
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [user.username];

      pool.connect((er, client, done) => {
        if (er) throw er;
        client.query(query, values, (e, r) => {
          done();
          if (e) {
            res.json({ status: 404, error: e.detail });
          } else {
            if (r.rowCount == 0) {
              res.json({ status: 404, error: 'Incorrect username' });
            } else {
              const hash = r.rows[0].password;
              bcrypt.compare(user.password, hash, function (err, response) {
                if (response) {
                  res.json({ status: 202, data: r.rows });
                } else {
                  res.json({ status: 404, error: 'Incorrect password' });
                }
              });
            }
          }
        });
      });
    }
  }
}

const user = new User();


export default user;
