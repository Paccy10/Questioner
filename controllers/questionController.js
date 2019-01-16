const express = require('express');

const router = express.Router({ mergeParams: true });

const Joi = require('joi');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

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

const questions = [
  {
    id: 1,
    createdOn: '03-01-2019',
    user: 1,
    meetup: 1,
    title: 'Can I bring my laptop',
    body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
    upvotes: 5,
    downvotes: 4,
  },
  {
    id: 2,
    createdOn: '05-01-2019',
    user: 3,
    meetup: 8,
    title: 'Lunch',
    body: 'Hello Andela! I would like to ask you if lunch is provided. Thank you!',
    upvotes: 10,
    downvotes: 12,
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

const upvotes = [];
const downvotes = [];

function validateQuestion(question) {
  const schema = Joi.object({
    meetup: Joi.number().integer().min(1),
    user: Joi.number().integer().min(1),
    title: Joi.string().required(),
    body: Joi.string().required(),
  }).unknown();

  return Joi.validate(question, schema);
}
function validateUser(user) {
  const schema = Joi.object({
    user: Joi.number().integer().min(1),
  }).unknown();

  return Joi.validate(user, schema);
}

router.post('/', (req, res) => {
  const question = {
    id: questions.length + 1,
    createdOn: new Date(),
    meetup: parseInt(req.params.meetup_id),
    user: parseInt(req.body.user),
    title: req.body.title,
    body: req.body.body,
    upvotes: 0,
    downvotes: 0,
  };

  let jsonResponse = {};

  const { error } = validateQuestion(question);

  if (error) {
    jsonResponse = { status: 404, error: error.details[0].message };
    res.json(jsonResponse);
  } else {
    let meetupFound = false;
    for (let j = 0; j < meetups.length; j++) {
      if (req.params.meetup_id == meetups[j].id) {
        meetupFound = true;
      }
    }
    if (meetupFound) {
      let userFound = false;
      for (let i = 0; i < users.length; i++) {
        if (question.user == users[i].id) {
          userFound = true;
        }
      }
      if (userFound) {
        const resultQuestion = [
          {
            user: question.user,
            meetup: question.meetup,
            title: question.title,
            body: question.body,
          },
        ];
        questions.push(question);
        jsonResponse = { status: 200, data: resultQuestion };
        res.json(jsonResponse);
      } else {
        jsonResponse = { status: 404, data: 'The User with given ID is not found' };
        res.json(jsonResponse);
      }
    } else {
      jsonResponse = { status: 404, data: 'The Meetup with given ID is not found' };
      res.json(jsonResponse);
    }
  }
});

router.patch('/:question_id/upvote', (req, res) => {
  const meetup = meetups.find(c => c.id === parseInt(req.params.meetup_id));
  const result = [];
  let jsonResponse = {};
  if (!meetup) {
    jsonResponse = { status: 404, error: 'The Meetup with given ID is not found' };
    res.json(jsonResponse);
  } else {
    const question = questions.find(c => c.id === parseInt(req.params.question_id));
    if (!question) {
      jsonResponse = { status: 404, error: 'The Question with given ID is not found' };
      res.json(jsonResponse);
    } else {
      const user = {
        user: parseInt(req.body.user),
      };
      const { error } = validateUser(user);
      if (error) {
        jsonResponse = { status: 404, error: error.details[0].message };
        res.json(jsonResponse);
      } else {
        const registeredUser = users.find(c => c.id === parseInt(user.user));
        if (!registeredUser) {
          jsonResponse = { status: 404, error: 'The User with given ID is not found' };
          res.json(jsonResponse);
        } else {
          const upvote = { question: question.id, user: registeredUser.id };
          const registeredUpvote = upvotes.find(c => c.question === upvote.question && c.user === upvote.user);
          const registeredDownvote = downvotes.find(c => c.question === upvote.question && c.user === upvote.user);
          if (registeredUpvote) {
            jsonResponse = { status: 404, error: 'The User has already upvoted the question' };
            res.json(jsonResponse);
          } else if (registeredDownvote) {
            const index = downvotes.indexOf(registeredDownvote);
            downvotes.splice(index, 1);
            upvotes.push(upvote);
            question.upvotes++;
            question.downvotes--;
            const resultquestion = {
              meetup: question.meetup,
              title: question.title,
              body: question.body,
              upvotes: question.upvotes,
              downvotes: question.downvotes,
            };
            result.push(resultquestion);
            jsonResponse = { status: 200, data: result };
            res.json(jsonResponse);
          } else {
            upvotes.push(upvote);
            question.upvotes++;
            const resultquestion = {
              meetup: question.meetup,
              title: question.title,
              body: question.body,
              upvotes: question.upvotes,
              downvotes: question.downvotes,
            };
            result.push(resultquestion);
            jsonResponse = { status: 200, data: result };
            res.json(jsonResponse);
          }
        }
      }
    }
  }
});

router.patch('/:question_id/downvote', (req, res) => {
  const meetup = meetups.find(c => c.id === parseInt(req.params.meetup_id));
  const result = [];
  let jsonResponse = {};
  if (!meetup) {
    jsonResponse = { status: 404, error: 'The Meetup with given ID is not found' };
    res.json(jsonResponse);
  } else {
    const question = questions.find(c => c.id === parseInt(req.params.question_id));
    if (!question) {
      jsonResponse = { status: 404, error: 'The Question with given ID is not found' };
      res.json(jsonResponse);
    } else {
      const user = {
        user: parseInt(req.body.user),
      };
      const { error } = validateUser(user);
      if (error) {
        jsonResponse = { status: 404, error: error.details[0].message };
        res.json(jsonResponse);
      } else {
        const registeredUser = users.find(c => c.id === parseInt(user.user));
        if (!registeredUser) {
          jsonResponse = { status: 404, error: 'The User with given ID is not found' };
          res.json(jsonResponse);
        } else {
          const downvote = { question: question.id, user: registeredUser.id };
          const registeredUpvote = upvotes.find(c => c.question === downvote.question && c.user === downvote.user);
          const registeredDownvote = downvotes.find(c => c.question === downvote.question && c.user === downvote.user);
          if (registeredDownvote) {
            jsonResponse = { status: 404, error: 'The User has already downvoted the question' };
            res.json(jsonResponse);
          } else if (registeredUpvote) {
            const index = upvotes.indexOf(registeredUpvote);
            upvotes.splice(index, 1);
            downvotes.push(downvote);
            question.upvotes--;
            question.downvotes++;
            const resultquestion = {
              meetup: question.meetup,
              title: question.title,
              body: question.body,
              upvotes: question.upvotes,
              downvotes: question.downvotes,
            };
            result.push(resultquestion);
            jsonResponse = { status: 200, data: result };
            res.json(jsonResponse);
          } else {
            downvotes.push(downvote);
            question.downvotes++;
            const resultquestion = {
              meetup: question.meetup,
              title: question.title,
              body: question.body,
              upvotes: question.upvotes,
              downvotes: question.downvotes,
            };
            result.push(resultquestion);
            jsonResponse = { status: 200, data: result };
            res.json(jsonResponse);
          }
        }
      }
    }
  }
});

module.exports = router;
