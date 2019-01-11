const express = require('express');

const router = express.Router();

const questions = [
  {
    id: 1,
    createdOn: '03-01-2019',
    createdBy: 1,
    meetup: 1,
    title: 'Can I bring my laptop',
    body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
    votes: 5,
  },
  {
    id: 2,
    createdOn: '05-01-2019',
    createdBy: 3,
    meetup: 8,
    title: 'Lunch',
    body: 'Hello Andela! I would like to ask you if lunch is provided. Thank you!',
    votes: 21,
  },
];

router.post('/', (req, res) => {
  const question = {
    id: questions.length + 1,
    createdOn: new Date(),
    createdBy: req.body.createdBy,
    meetup: req.body.meetup,
    title: req.body.title,
    body: req.body.body,
    votes: 0,
  };

  let jsonResponse = {};

  if (questions.push(question)) {
    const resultQuestion = [
      {
        user: question.createdBy,
        meetup: question.meetup,
        title: question.title,
        body: question.body,
      },
    ];
    jsonResponse = { status: 200, data: resultQuestion };
    res.json(jsonResponse);
  } else {
    jsonResponse = { status: 404, error: 'Meetup not saved!' };
    res.json(jsonResponse);
  }
});

router.patch('/:id/upvote', (req, res) => {
  const question = questions.find(c => c.id === parseInt(req.params.id));
  const result = [];
  let jsonResponse = {};
  if (!question) {
    jsonResponse = { status: 404, error: 'The Question with given ID is not found' };
    res.json(jsonResponse);
  } else {
    question.votes++;
    const resultquestion = {
      meetup: question.meetup,
      title: question.title,
      body: question.body,
      votes: question.votes,
    };
    result.push(resultquestion);
    jsonResponse = { status: 200, data: result };
    res.json(jsonResponse);
  }
});

router.patch('/:id/downvote', (req, res) => {
  const question = questions.find(c => c.id === parseInt(req.params.id));
  const result = [];
  let jsonResponse = {};
  if (!question) {
    jsonResponse = { status: 404, error: 'The Question with given ID is not found' };
    res.json(jsonResponse);
  } else {
    question.votes--;
    const resultquestion = {
      meetup: question.meetup,
      title: question.title,
      body: question.body,
      votes: question.votes,
    };
    result.push(resultquestion);
    jsonResponse = { status: 200, data: result };
    res.json(jsonResponse);
  }
});

module.exports = router;