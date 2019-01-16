const express = require('express');

const router = express.Router({ mergeParams: true });

const Joi = require('joi');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

const moment = require('moment');

const meetups = [
  {
    id: 1,
    createdOn: '03-01-2019',
    location: 'Telecom House',
    images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
    topic: 'Nodejs Meetup',
    happeningOn: '2019-01-10',
    tags: ['Javascript', 'Programming'],
  },
  {
    id: 2,
    createdOn: '03-01-2019',
    location: 'Telecom House',
    images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
    topic: 'Express Meetup',
    happeningOn: '2019-01-20',
    tags: ['Javascript', 'Programming'],
  },
];

const rsvps = [
  {
    id: 1,
    meetup: 2,
    user: 1,
    response: 'yes',
  },
  {
    id: 2,
    meetup: 4,
    user: 5,
    response: 'No',
  },
];

const users = [
  {
    id: 1,
    firstname: 'Pacifique',
    lastname: 'Ndayisenga',
    othername: 'Clement',
    email: 'pacifiqueclement@gmail.com',
    phoneNumber: '0781983488',
    username: 'Paccy10',
    registered: '2019-01-16',
    isAdmin: false,
  },
  {
    id: 2,
    firstname: 'Fabrice',
    lastname: 'Manzi',
    othername: '',
    email: 'manzif60@gmail.com',
    phoneNumber: '0727117907',
    username: 'Manzif60',
    registered: '2019-01-16',
    isAdmin: false,
  },
];

function validateMeetup(meetup) {
  const schema = Joi.object({
    location: Joi.string().required(),
    topic: Joi.string().required(),
    happeningOn: Joi.required(),
  }).unknown();

  return Joi.validate(meetup, schema);
}

function validateRsvp(rsvp) {
  const schema = Joi.object({
    meetup: Joi.number().integer().min(1),
    user: Joi.number().integer().min(1),
    response: Joi.string().required(),
  }).unknown();

  return Joi.validate(rsvp, schema);
}

router.get('/', function (req, res) {
  if (meetups) {
    const resultMeetups = [];
    for (let i = 0; i < meetups.length; i++) {
      const meetup = {
        id: meetups[i].id,
        title: meetups[i].topic,
        location: meetups[i].location,
        happeningOn: meetups[i].happeningOn,
        tags: meetups[i].tags,
      };

      resultMeetups.push(meetup);
    }
    const jsonResponse = { status: 200, data: resultMeetups };
    res.json(jsonResponse);
  } else {
    const jsonResponse = { status: 404, error: 'Error' };
    res.json(jsonResponse);
  }
});

router.get('/upcoming', function (req, res) {
  if (meetups) {
    const upcomingMeetups = [];
    for (let i = 0; i < meetups.length; i++) {
      if (meetups[i].happeningOn > new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) {
        const meetup = {
          id: meetups[i].id,
          title: meetups[i].topic,
          location: meetups[i].location,
          happeningOn: meetups[i].happeningOn,
          tags: meetups[i].tags,
        };
        upcomingMeetups.push(meetup);
      }
    }
    const jsonResponse = { status: 200, data: upcomingMeetups };
    res.json(jsonResponse);
  } else {
    const jsonResponse = { status: 404, error: 'Error' };
    res.json(jsonResponse);
  }
});

router.get('/:id', function (req, res) {
  const meetup = meetups.find(c => c.id === parseInt(req.params.id));
  const result = [];
  let jsonResponse = {};
  if (!meetup) {
    jsonResponse = { status: 404, error: 'The Meetup with given ID is not found' };
    res.json(jsonResponse);
  } else {
    const resultMeetup = {
      id: meetup.id,
      topic: meetup.topic,
      location: meetup.location,
      happeningOn: meetup.happeningOn,
      tags: meetup.tags,
    };
    result.push(resultMeetup);
    jsonResponse = { status: 200, data: result };
    res.json(jsonResponse);
  }
});

router.post('/', function (req, res) {
  const meetup = {
    id: meetups.length + 1,
    createdOn: moment(new Date()).format('YYYY-MM-DD'),
    location: req.body.location,
    images: req.body.images,
    topic: req.body.topic,
    happeningOn: req.body.happeningOn,
    tags: req.body.tags,
  };

  let jsonResponse = {};

  const { error } = validateMeetup(meetup);

  if (error) {
    jsonResponse = { status: 404, error: error.details[0].message };
    res.json(jsonResponse);
  } else {
    if (!moment(meetup.happeningOn, 'YYYY-MM-DD', true).isValid()) {
      jsonResponse = { status: 404, error: 'Invalid date format' };
      res.json(jsonResponse);
    } else if (meetup.happeningOn < meetup.createdOn) {
      jsonResponse = { status: 404, error: 'Invalid date' };
      res.json(jsonResponse);
    } else {
      const response = [
        {
          topic: meetup.topic,
          location: meetup.location,
          happeningOn: meetup.happeningOn,
          tags: meetup.tags,
        },
      ];
      meetups.push(meetup);
      jsonResponse = { status: 200, data: response };
      res.json(jsonResponse);
    }
  }
});

router.post('/:id/rsvps', function (req, res) {
  const meetup = meetups.find(c => c.id === parseInt(req.params.id));
  const user = users.find(c => c.id === parseInt(req.body.user));
  const result = [];
  let jsonResponse = {};
  const rsvp = {
    id: rsvps.length + 1,
    meetup: parseInt(req.params.id),
    user: parseInt(req.body.user),
    response: req.body.response,
  };
  const { error } = validateRsvp(rsvp);
  if (error) {
    jsonResponse = { status: 404, error: error.details[0].message };
    res.json(jsonResponse);
  } else {
    if (!meetup) {
      jsonResponse = { status: 404, error: 'The Meetup with given ID is not found' };
      res.json(jsonResponse);
    } else {
      if (!user) {
        jsonResponse = { status: 404, error: 'The User with given ID is not found' };
        res.json(jsonResponse);
      } else {
        const resultRsvp = {
          meetup: rsvp.meetup,
          topic: meetup.topic,
          status: rsvp.response,
        };
        rsvps.push(rsvp);
        result.push(resultRsvp);
        jsonResponse = { status: 200, data: result };
        res.json(jsonResponse);
      }
    }
  }
});


module.exports = router;
