import moment from 'moment';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import validateMeetup from '../helpers/validateMeetup';
import validateRsvp from '../helpers/validateRsvp';
import queries from '../db/queries';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Meetup {
  create(req, res) {
    const meetup = {
      created_on: moment(new Date()),
      location: req.body.location,
      images: req.body.images,
      topic: req.body.topic,
      happening_on: req.body.happening_on,
      tags: req.body.tags,
    };

    const { error } = validateMeetup(meetup);

    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      if (meetup.happening_on.trim().length == 0) {
        res.status(400).json({ status: 400, error: 'happening_on is not allowed to be empty' });
      } else if (!moment(meetup.happening_on.trim(), 'YYYY-MM-DD', true).isValid()) {
        res.status(400).json({ status: 400, error: 'Invalid date format.It must be(YYYY-MM-DD)' });
      } else if (moment(meetup.happening_on.trim()).format('YYYY-MM-DD') < moment(meetup.created_on).format('YYYY-MM-DD')) {
        res.status(400).json({ status: 400, error: 'Invalid date' });
      } else {
        const query = queries.createMeetup;
        const values = [meetup.created_on, meetup.location.trim().replace(/\s+/g, ' '), meetup.images, meetup.topic.trim().replace(/\s+/g, ' '), meetup.happening_on.trim(), meetup.tags];
        pool.connect((er, client, done) => {
          if (er) throw er;
          client.query(query, values, (e, r) => {
            done();
            if (e) {
              res.status(400).json({ status: 400, error: e.detail });
            } else {
              res.status(201).json({ status: 201, data: r.rows });
            }
          });
        });
      }
    }
  }

  getOne(req, res) {
    if (!Number.isInteger(Number(req.params.id))) {
      res.status(400).json({ status: 400, error: 'The Meetup ID must be an integer' });
    } else {
      const query = queries.getOneMeetup;
      const values = [parseInt(req.params.id)];
      pool.connect((er, client, done) => {
        if (er) throw er;
        client.query(query, values, (e, r) => {
          done();
          if (e) {
            res.status(404).json({ status: 404, error: e.detail });
          } else {
            if (r.rowCount == 0) {
              res.status(404).json({ status: 404, error: 'The Meetup with given ID is not found' });
            } else {
              res.status(200).json({ status: 200, data: r.rows });
            }
          }
        });
      });
    }
  }

  getAll(req, res) {
    const query = queries.getAllMeetups;

    pool.connect((er, client, done) => {
      if (er) throw er;
      client.query(query, (e, r) => {
        done();
        if (e) {
          res.status(404).json({ status: 404, error: e.detail });
        } else {
          res.status(200).json({ status: 200, data: r.rows });
        }
      });
    });
  }

  getUpcoming(req, res) {
    const query = queries.getUpcomingMeetups;
    const values = [moment(new Date())];

    pool.connect((er, client, done) => {
      if (er) throw er;
      client.query(query, values, (e, r) => {
        done();
        if (e) {
          res.status(404).json({ status: 404, error: e.detail });
        } else {
          res.status(200).json({ status: 200, data: r.rows });
        }
      });
    });
  }

  delete(req, res) {
    if (!Number.isInteger(Number(req.params.id))) {
      res.status(400).json({ status: 400, error: 'The Meetup ID must be an integer' });
    } else {
      const query = queries.deleteMeetup;
      const values = [parseInt(req.params.id)];
      pool.connect((er, client, done) => {
        if (er) throw er;
        client.query(query, values, (e, r) => {
          done();
          if (e) {
            res.status(404).json({ status: 404, error: e.detail });
          } else {
            if (r.rowCount == 0) {
              res.status(404).json({ status: 404, error: 'The Meetup with given ID is not found' });
            } else {
              res.status(200).json({ status: 200, message: 'Meetup successfuly deleted' });
            }
          }
        });
      });
    }
  }

  createRsvp(req, res) {
    const rsvp = {
      meetup_id: req.params.id,
      user_id: req.body.user,
      response: req.body.response,
    };
    const { error } = validateRsvp(rsvp);
    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      const query = queries.createRsvp;
      const values = [parseInt(rsvp.meetup_id), rsvp.user_id, rsvp.response.trim()];

      if (rsvp.response.trim().toLowerCase() === 'yes' || rsvp.response.trim().toLowerCase() === 'no' || rsvp.response.trim().toLowerCase() === 'maybe') {
        pool.connect((er, client, done) => {
          if (er) throw er;
          client.query(query, values, (e, r) => {
            done();
            if (e) {
              res.status(400).json({ status: 400, error: e.detail });
            } else {
              res.status(201).json({ status: 201, data: r.rows });
            }
          });
        });
      } else {
        res.status(400).json({ status: 400, error: 'Invalid response. It must be(Yes, No or Maybe)' });
      }
    }
  }
}

const meetup = new Meetup();

export default meetup;
