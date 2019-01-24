import moment from 'moment';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validateUserSignup from '../helpers/validateUserSignup';
import validateUserLogin from '../helpers/validateUserLogin';
import queries from '../db/queries';
import authKey from '../middlewares/keys';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class User {
  signup(req, res) {
    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      othername: req.body.othername,
      email: req.body.email,
      phone_number: req.body.phone_number,
      username: req.body.username,
      password: req.body.password,
      registered: moment(new Date()),
    };

    const { error } = validateUserSignup(user);
    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      if (/(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/.test(user.phone_number.trim()) == false) {
        res.json({ status: 404, error: 'Invalid Phone number. It must look like (+250780000000 or 0780000000)' });
      } else {
        bcrypt.hash(user.password.trim(), 10, function (err, hash) {
          if (err) {
            res.status(404).json({ status: 404, error: err });
          } else {
            const query = queries.signup;
            const values = [user.firstname.trim().replace(/\s+/g, ' '), user.lastname.trim().replace(/\s+/g, ' '), user.othername, user.email.trim().replace(/\s+/g, ''), user.phone_number.trim(), user.username.trim().replace(/\s+/g, ' '), hash, user.registered];
            pool.connect((er, client, done) => {
              if (er) throw er;
              client.query(query, values, (e, r) => {
                done();
                if (e) {
                  res.status(400).json({ status: 400, error: e.detail });
                } else {
                  const userlog = {
                    id: r.rows[0].id,
                    firstname: r.rows[0].firstname,
                    lastname: r.rows[0].lastname,
                    othername: r.rows[0].othername,
                    email: r.rows[0].email,
                    phone_number: r.rows[0].phone_number,
                    username: r.rows[0].username,
                  };

                  jwt.sign(userlog, authKey, { expiresIn: 3600 }, (err1, token) => {
                    if (err1) {
                      throw err1;
                    }
                    res.status(201).json({
                      status: 201,
                      data: [{
                        token,
                        user: r.rows[0],
                      }],
                    });
                  });
                }
              });
            });
          }
        });
      }
    }
  }

  login(req, res) {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };

    const { error } = validateUserLogin(user);
    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      const query = queries.login;
      const values = [user.username.trim()];

      pool.connect((er, client, done) => {
        if (er) throw er;
        client.query(query, values, (e, r) => {
          done();
          if (e) {
            res.json({ status: 404, error: e.detail });
          } else {
            if (r.rowCount == 0) {
              res.status(404).json({ status: 404, error: 'Incorrect username' });
            } else {
              const hash = r.rows[0].password;
              bcrypt.compare(user.password.trim(), hash, function (err, response) {
                if (response) {
                  const userlog = {
                    id: r.rows[0].id,
                    firstname: r.rows[0].firstname,
                    lastname: r.rows[0].lastname,
                    othername: r.rows[0].othername,
                    email: r.rows[0].email,
                    phone_number: r.rows[0].phone_number,
                    username: r.rows[0].username,
                  };

                  jwt.sign(userlog, authKey, { expiresIn: 3600 }, (err1, token) => {
                    if (err1) {
                      throw err1;
                    }
                    res.status(200).json({
                      status: 200,
                      data: [{
                        token,
                        user: r.rows[0],
                      }],
                    });
                  });
                } else {
                  res.status(404).json({ status: 404, error: 'Incorrect password' });
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
