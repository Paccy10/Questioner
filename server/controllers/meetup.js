import moment from 'moment';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import validateMeetup from '../helpers/validateMeetup';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Meetup {
  // create(req, res) {
  //   const meetup = {
  //     created_on: moment(new Date()),
  //     location: req.body.location.trim().replace(/\s+/g, ' '),
  //     images: req.body.images,
  //     topic: req.body.topic.trim().replace(/\s+/g, ' '),
  //     happening_on: req.body.happening_on.trim(),
  //     tags: req.body.tags,
  //   };

  //   const { error } = validateMeetup(meetup);

  //   if (error) {
  //     res.json({ status: 404, error: error.details[0].message });
  //   } else {
  //     if (meetup.happening_on.length == 0) {
  //       res.json({ status: 404, error: 'happening_on is required' });
  //     } else if (!moment(meetup.happening_on, 'YYYY-MM-DD', true).isValid()) {
  //       res.json({ status: 404, error: 'Invalid date format.It must be(YYYY-MM-DD)' });
  //     } else if (moment(meetup.happening_on).format('YYYY-MM-DD') < moment(meetup.created_on).format('YYYY-MM-DD')) {
  //       res.json({ status: 404, error: 'Invalid date' });
  //     } else {
  //       const query = 'INSERT INTO meetups(created_on, location, images, topic, happening_on, tags) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  //       const values = [meetup.created_on, meetup.location, meetup.images, meetup.topic, meetup.happening_on, meetup.tags];
  //       pool.connect((er, client, done) => {
  //         if (er) throw er;
  //         client.query(query, values, (e, r) => {
  //           done();
  //           if (e) {
  //             res.json({ status: 404, error: e.detail });
  //           } else {
  //             res.json({ status: 200, data: r.rows });
  //           }
  //         });
  //       });
  //     }
  //   }
  // }

  // getOne(req, res) {
  //   if (!Number.isInteger(Number(req.params.id))) {
  //     res.json({ status: 404, error: 'The Meetup ID must be an integer' });
  //   } else {
  //     // const meetup = meetups.find(c => c.id === parseInt(req.params.id));
  //     const query = 'SELECT * FROM meetups WHERE id = $1';
  //     const values = [parseInt(req.params.id)];
  //     pool.connect((er, client, done) => {
  //       if (er) throw er;
  //       client.query(query, values, (e, r) => {
  //         done();
  //         if (e) {
  //           res.json({ status: 404, error: e.detail });
  //         } else {
  //           if (r.rowCount == 0) {
  //             res.json({ status: 404, error: 'The Meetup with given ID is not found' });
  //           } else {
  //             res.json({ status: 200, data: r.rows[0] });
  //           }
  //         }
  //       });
  //     });
  //   }
  // }

  getAll(req, res) {
    const query = 'SELECT * FROM meetups';

    pool.connect((er, client, done) => {
      if (er) throw er;
      client.query(query, (e, r) => {
        done();
        if (e) {
          res.json({ status: 404, error: e.detail });
        } else {
          res.json({ status: 200, data: r.rows });
        }
      });
    });
  }

  // getUpcoming(req, res) {
  //   const query = 'SELECT * FROM meetups WHERE happening_on >= $1';
  //   const values = [moment(new Date())];

  //   pool.connect((er, client, done) => {
  //     if (er) throw er;
  //     client.query(query, values, (e, r) => {
  //       done();
  //       if (e) {
  //         res.json({ status: 404, error: e.detail });
  //       } else {
  //         res.json({ status: 200, data: r.rows });
  //       }
  //     });
  //   });
  // }
}

const meetup = new Meetup();

export default meetup;

// router.get('/', function (req, res) {
//   if (meetups) {
//     const resultMeetups = [];
//     for (let i = 0; i < meetups.length; i++) {
//       const meetup = {
//         id: meetups[i].id,
//         title: meetups[i].topic,
//         location: meetups[i].location,
//         happeningOn: meetups[i].happeningOn,
//         tags: meetups[i].tags,
//       };

//       resultMeetups.push(meetup);
//     }
//     const jsonResponse = { status: 200, data: resultMeetups };
//     res.json(jsonResponse);
//   } else {
//     const jsonResponse = { status: 404, error: 'Error' };
//     res.json(jsonResponse);
//   }
// });

// router.get('/upcoming', function (req, res) {
//   if (meetups) {
//     const upcomingMeetups = [];
//     for (let i = 0; i < meetups.length; i++) {
//       if (meetups[i].happeningOn > new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) {
//         const meetup = {
//           id: meetups[i].id,
//           title: meetups[i].topic,
//           location: meetups[i].location,
//           happeningOn: meetups[i].happeningOn,
//           tags: meetups[i].tags,
//         };
//         upcomingMeetups.push(meetup);
//       }
//     }
//     const jsonResponse = { status: 200, data: upcomingMeetups };
//     res.json(jsonResponse);
//   } else {
//     const jsonResponse = { status: 404, error: 'Error' };
//     res.json(jsonResponse);
//   }
// });

// router.get('/:id', function (req, res) {
//   const result = [];
//   let jsonResponse = {};
//   if (!Number.isInteger(Number(req.params.id))) {
//     jsonResponse = { status: 404, error: 'The Meetup ID must be an integer' };
//     res.json(jsonResponse);
//   } else {
//     const meetup = meetups.find(c => c.id === parseInt(req.params.id));
//     if (!meetup) {
//       jsonResponse = { status: 404, error: 'The Meetup with given ID is not found' };
//       res.json(jsonResponse);
//     } else {
//       const resultMeetup = {
//         id: meetup.id,
//         topic: meetup.topic,
//         location: meetup.location,
//         happeningOn: meetup.happeningOn,
//         tags: meetup.tags,
//       };
//       result.push(resultMeetup);
//       jsonResponse = { status: 200, data: result };
//       res.json(jsonResponse);
//     }
//   }
// });

// router.post('/', function (req, res) {
//   const meetup = {
//     id: meetups.length + 1,
//     createdOn: moment(new Date()).format('YYYY-MM-DD'),
//     location: req.body.location.trim().replace(/\s+/g, ' '),
//     images: req.body.images,
//     topic: req.body.topic.trim().replace(/\s+/g, ' '),
//     happeningOn: req.body.happeningOn.trim(),
//     tags: req.body.tags,
//   };

//   let jsonResponse = {};

//   const { error } = validateMeetup(meetup);

//   if (error) {
//     jsonResponse = { status: 404, error: error.details[0].message };
//     res.json(jsonResponse);
//   } else {
//     if (meetup.happeningOn.length == 0) {
//       jsonResponse = { status: 404, error: 'happeningOn is required' };
//       res.json(jsonResponse);
//     } else if (!moment(meetup.happeningOn, 'YYYY-MM-DD', true).isValid()) {
//       jsonResponse = { status: 404, error: 'Invalid date format.It must be(YYYY-MM-DD)' };
//       res.json(jsonResponse);
//     } else if (meetup.happeningOn < meetup.createdOn) {
//       jsonResponse = { status: 404, error: 'Invalid date' };
//       res.json(jsonResponse);
//     } else {
//       const response = [
//         {
//           topic: meetup.topic,
//           location: meetup.location,
//           happeningOn: meetup.happeningOn,
//           tags: meetup.tags,
//         },
//       ];
//       meetups.push(meetup);
//       jsonResponse = { status: 200, data: response };
//       res.json(jsonResponse);
//     }
//   }
// });

// router.post('/:id/rsvps', function (req, res) {
//   const meetup = meetups.find(c => c.id === parseInt(req.params.id));
//   const user = users.find(c => c.id === parseInt(req.body.user));
//   const result = [];
//   let jsonResponse = {};
//   const rsvp = {
//     id: rsvps.length + 1,
//     meetup: req.params.id,
//     user: req.body.user,
//     response: req.body.response.trim().replace(/\s+/g, ' '),
//   };
//   const { error } = validateRsvp(rsvp);
//   if (error) {
//     jsonResponse = { status: 404, error: error.details[0].message };
//     res.json(jsonResponse);
//   } else {
//     if (!meetup) {
//       jsonResponse = { status: 404, error: 'The Meetup with given ID is not found' };
//       res.json(jsonResponse);
//     } else {
//       if (!user) {
//         jsonResponse = { status: 404, error: 'The User with given ID is not found' };
//         res.json(jsonResponse);
//       } else {
//         if (rsvp.response.toLowerCase() === 'yes' || rsvp.response.toLowerCase() === 'no' || rsvp.response.toLowerCase() === 'maybe') {
//           const resultRsvp = {
//             meetup: parseInt(rsvp.meetup),
//             topic: meetup.topic,
//             status: rsvp.response,
//             user: parseInt(rsvp.user),
//           };
//           rsvps.push(rsvp);
//           result.push(resultRsvp);
//           jsonResponse = { status: 200, data: result };
//           res.json(jsonResponse);
//         } else {
//           jsonResponse = { status: 404, error: 'Invalid response' };
//           res.json(jsonResponse);
//         }
//       }
//     }
//   }
// });


// module.exports = router;
