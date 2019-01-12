const express = require('express');

const router = express.Router();

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
        upcomingMeetups.push(meetups[i]);
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
    createdOn: new Date(),
    location: req.body.location,
    images: req.body.images,
    topic: req.body.topic,
    happeningOn: req.body.happeningOn,
    tags: req.body.tags,
  };

  let jsonResponse = {};

  if (meetups.push(meetup)) {
    const response = [
      {
        topic: meetup.topic,
        location: meetup.location,
        happeningOn: meetup.happeningOn,
        tags: meetup.tags,
      },
    ];
    jsonResponse = { status: 200, data: response };
    res.json(jsonResponse);
  } else {
    jsonResponse = { status: 404, error: 'Meetup not saved!' };
    res.json(jsonResponse);
  }
});

router.post('/:id/rsvps', function (req, res) {
  const meetup = meetups.find(c => c.id === parseInt(req.params.id));
  const result = [];
  let jsonResponse = {};
  if (!meetup) {
    jsonResponse = { status: 404, error: 'The Meetup with given ID is not found' };
    res.json(jsonResponse);
  } else {
    const rsvp = {
      id: rsvps.length + 1,
      meetup: req.params.id,
      user: req.body.user,
      response: req.body.response,
    };
    if (rsvps.push(rsvp)) {
      const resultRsvp = {
        meetup: rsvp.meetup,
        topic: meetup.topic,
        status: rsvp.response,
      };
      result.push(resultRsvp);
      jsonResponse = { status: 200, data: result };
      res.json(jsonResponse);
    } else {
      jsonResponse = { status: 404, error: 'Error' };
      res.json(jsonResponse);
    }
  }
});

module.exports = router;
