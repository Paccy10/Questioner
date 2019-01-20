const express = require('express');

const router = express.Router({ mergeParams: true });

const Joi = require('joi');

const bodyParser = require('body-parser');

const moment = require('moment');

const { Pool } = require('pg');

const dotenv = require('dotenv');

const bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: false }));

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function validateUser(user) {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    phone_number: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    registered: Joi.required(),
  }).unknown();

  return Joi.validate(user, schema);
}

router.post('/signup', function (req, res) {
  const user = {
    firstname: req.body.firstname.trim().replace(/\s+/g, ' '),
    lastname: req.body.lastname.trim().replace(/\s+/g, ' '),
    othername: req.body.othername.trim().replace(/\s+/g, ' '),
    email: req.body.email.trim().replace(/\s+/g, ''),
    phone_number: req.body.phone_number.trim(),
    username: req.body.username.trim().replace(/\s+/g, ' '),
    password: req.body.password.trim().replace(/\s+/g, ''),
    registered: moment(new Date()),
  };

  const { error } = validateUser(user);
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
});

module.exports = router;
