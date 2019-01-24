[![Build Status](https://travis-ci.com/Paccy10/Questioner.svg?branch=data_structure)](https://travis-ci.com/Paccy10/Questioner)
[![Coverage Status](https://coveralls.io/repos/github/Paccy10/Questioner/badge.svg?branch=data_structure)](https://coveralls.io/github/Paccy10/Questioner?branch=data_structure)
<a href="https://codeclimate.com/github/codeclimate/codeclimate/maintainability"><img src="https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability" /></a>

# Questioner
Andela Developer Challenge

# *Tools*

- Git
- Express
- Nodejs

# *Installation*

git clone https://github.com/Paccy10/Questioner.git

npm install

# *To start the server*

npm start

# *To run tests*

npm test

# API Endpoints

  `POST api/v1/meetups` to create a meetup

  `GET api/v1/meetups` to get all meetups

  `GET api/v1/meetups/upcoming` to get all upcoming meetups

  `GET api/v1/meetups/:id` to get a specific meetup

  `DELETE api/v1/meetups/:id` to delete a specific meetup

  `POST api/v1/meetups/:id/rsvps` to create a meetup rsvp

  `POST api/v1/meetups/:id/questions` to create a meetup question

  `PATCH api/v1/meetups/:id/questions/:id/upvote` to upvote a question

  `PATCH api/v1/meetups/:id/questions/:id/downvote` to downvote a question

  `POST api/v1/meetups/:id/questions/:id/comments` to comment on a particular meetup question