import chai from 'chai';

import chaiHttp from 'chai-http';

import moment from 'moment';

import app from '../../app';

import db from '../db/seeder';

chai.should();
chai.use(chaiHttp);
chai.use(require('chai-things'));


describe('Questioner', () => {
  before((done) => {
    db.removeAllUsers();
    db.removeAllMeetups();
    db.addUser();
    db.addMeetup();
    done();
  });

  describe('Users', () => {
    it('should SIGNUP a user', (done) => {
      const user = {
        firstname: 'Charles',
        lastname: 'Mutagorama',
        othername: '',
        email: 'cmutagorama@gmail.com',
        phone_number: '0781983488',
        username: 'CharlyMuta',
        password: 'password',
        registered: moment(new Date()),
      };
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.should.all.have.property('firstname', user.firstname);
          res.body.data.should.all.have.property('lastname', user.lastname);
          res.body.data.should.all.have.property('othername', user.othername);
          res.body.data.should.all.have.property('email', user.email);
          res.body.data.should.all.have.property('phone_number', user.phone_number);
          res.body.data.should.all.have.property('username', user.username);
          done();
        });
    });

    it('should Login a user', (done) => {
      const user = {
        username: 'Paccy10',
        password: 'password',
      };

      const userResponse = {
        firstname: 'Pacifique',
        lastname: 'Ndayisenga',
        othername: 'Clement',
        email: 'pacifiqueclement@gmail.com',
        phone_number: '0781983488',
        username: 'Paccy10',
        password: '$2a$10$9ErZa7Rw/OPHp1mLllOi1uK/3omWtjaagg.fZyquC3i11rn0WoKZ.',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.should.all.have.property('firstname', userResponse.firstname);
          res.body.data.should.all.have.property('lastname', userResponse.lastname);
          res.body.data.should.all.have.property('othername', userResponse.othername);
          res.body.data.should.all.have.property('email', userResponse.email);
          res.body.data.should.all.have.property('phone_number', userResponse.phone_number);
          res.body.data.should.all.have.property('username', userResponse.username);
          done();
        });
    });
  });

  describe('Meetups', () => {
    it('should GET all the meetups', (done) => {
      chai.request(app)
        .get('/api/v1/meetups')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.should.all.have.property('id');
          res.body.data.should.all.have.property('created_on');
          res.body.data.should.all.have.property('location');
          res.body.data.should.all.have.property('images');
          res.body.data.should.all.have.property('topic');
          res.body.data.should.all.have.property('happening_on');
          res.body.data.should.all.have.property('tags');
          done();
        });
    });
  });
});

// describe('Meetups', () => {
//   it('should GET all the meetups', (done) => {
//     chai.request(app)
//       .get('/api/v1/meetups')
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('id');
//         res.body.data.should.all.have.property('title');
//         res.body.data.should.all.have.property('location');
//         res.body.data.should.all.have.property('happeningOn');
//         res.body.data.should.all.have.property('tags');
//         done();
//       });
//   });

//   it('should GET all the upcoming meetups', (done) => {
//     chai.request(app)
//       .get('/api/v1/meetups/upcoming')
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('id');
//         res.body.data.should.all.have.property('title');
//         res.body.data.should.all.have.property('location');
//         res.body.data.should.all.have.property('happeningOn');
//         res.body.data.should.all.have.property('tags');
//         done();
//       });
//   });

//   it('should POST a meetup', (done) => {
//     const meetup = {
//       createdOn: '2019-01-16',
//       location: 'Telecom House',
//       images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
//       topic: 'Nodejs Meetup',
//       happeningOn: '2019-03-20',
//       tags: ['Javascript', 'Programming'],
//     };
//     chai.request(app)
//       .post('/api/v1/meetups')
//       .send(meetup)
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('topic', meetup.topic);
//         res.body.data.should.all.have.property('location', meetup.location);
//         res.body.data.should.all.have.property('happeningOn', meetup.happeningOn);
//         res.body.data.should.all.have.property('tags');
//         done();
//       });
//   });

//   it('should GET a meetup with the given id', (done) => {
//     const meetup = {
//       id: 1,
//       createdOn: '2019-01-03',
//       location: 'Telecom House',
//       images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
//       topic: 'Nodejs Meetup',
//       happeningOn: '2019-01-10',
//       tags: ['Javascript', 'Programming'],
//     };
//     chai.request(app)
//       .get('/api/v1/meetups/' + meetup.id)
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status').eql(200);
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('id', meetup.id);
//         res.body.data.should.all.have.property('topic', meetup.topic);
//         res.body.data.should.all.have.property('location', meetup.location);
//         res.body.data.should.all.have.property('happeningOn', meetup.happeningOn);
//         res.body.data.should.all.have.property('tags');
//         done();
//       });
//   });

//   it('it should POST an Rsvp on a meetup', (done) => {
//     const meetup = {
//       id: 1,
//       createdOn: '2019-01-03',
//       location: 'Telecom House',
//       images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
//       topic: 'Nodejs Meetup',
//       happeningOn: '2019-01-10',
//       tags: ['Javascript', 'Programming'],
//     };

//     const rsvp = {
//       id: 1,
//       meetup: meetup.id,
//       user: 1,
//       response: 'yes',
//     };
//     chai.request(app)
//       .post('/api/v1/meetups/' + meetup.id + '/rsvps')
//       .send(rsvp)
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('meetup', rsvp.meetup);
//         res.body.data.should.all.have.property('topic', meetup.topic);
//         res.body.data.should.all.have.property('status', rsvp.response);
//         res.body.data.should.all.have.property('user', rsvp.user);
//         done();
//       });
//   });
// });

// describe('Questions', () => {
//   it('should POST a question', (done) => {
//     const meetup = {
//       id: 1,
//       createdOn: '2019-01-16',
//       location: 'Telecom House',
//       images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
//       topic: 'Nodejs Meetup',
//       happeningOn: '2019-01-20',
//       tags: ['Javascript', 'Programming'],
//     };
//     const question = {
//       id: 1,
//       createdOn: '2019-01-16',
//       user: 1,
//       meetup: 1,
//       title: 'Can I bring my laptop',
//       body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
//       upvotes: 0,
//       downvotes: 0,
//     };
//     chai.request(app)
//       .post('/api/v1/meetups/' + meetup.id + '/questions')
//       .send(question)
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('user', question.user);
//         res.body.data.should.all.have.property('meetup', question.meetup);
//         res.body.data.should.all.have.property('title', question.title);
//         res.body.data.should.all.have.property('body', question.body);
//         done();
//       });
//   });

//   it('should UPDATE(increase) the number of votes of a question with the given id', (done) => {
//     const meetup = {
//       id: 1,
//       createdOn: '2019-01-16',
//       location: 'Telecom House',
//       images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
//       topic: 'Nodejs Meetup',
//       happeningOn: '2019-01-20',
//       tags: ['Javascript', 'Programming'],
//     };
//     const question = {
//       id: 1,
//       createdOn: '03-01-2019',
//       user: 1,
//       meetup: 1,
//       title: 'Can I bring my laptop',
//       body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
//       upvotes: 5,
//       downvotes: 4,
//     };
//     chai.request(app)
//       .patch('/api/v1/meetups/' + meetup.id + '/questions/' + question.id + '/upvote')
//       .send({
//         id: 1,
//         createdOn: '03-01-2019',
//         user: 1,
//         meetup: 1,
//         title: 'Can I bring my laptop',
//         body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
//         upvotes: question.upvotes++,
//         downvotes: question.downvotes,
//       })
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('meetup', question.meetup);
//         res.body.data.should.all.have.property('title', question.title);
//         res.body.data.should.all.have.property('body', question.body);
//         res.body.data.should.all.have.property('upvotes', question.upvotes);
//         res.body.data.should.all.have.property('downvotes', question.downvotes);
//         done();
//       });
//   });

//   it('it should UPDATE(decrease) the number of votes of a question with the given id', (done) => {
//     const meetup = {
//       id: 1,
//       createdOn: '2019-01-16',
//       location: 'Telecom House',
//       images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
//       topic: 'Nodejs Meetup',
//       happeningOn: '2019-01-20',
//       tags: ['Javascript', 'Programming'],
//     };
//     const question = {
//       id: 1,
//       createdOn: '03-01-2019',
//       user: 1,
//       meetup: 1,
//       title: 'Can I bring my laptop',
//       body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
//       upvotes: 5,
//       downvotes: 4,
//     };
//     chai.request(app)
//       .patch('/api/v1/meetups/' + meetup.id + '/questions/' + question.id + '/downvote')
//       .send({
//         id: 1,
//         createdOn: '03-01-2019',
//         user: 1,
//         meetup: 1,
//         title: 'Can I bring my laptop',
//         body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
//         upvotes: question.upvotes,
//         downvotes: question.downvotes++,
//       })
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         res.body.data.should.all.have.property('meetup', question.meetup);
//         res.body.data.should.all.have.property('title', question.title);
//         res.body.data.should.all.have.property('body', question.body);
//         res.body.data.should.all.have.property('upvotes', question.upvotes);
//         res.body.data.should.all.have.property('downvotes', question.downvotes);
//         done();
//       });
//   });
// });

// describe('Authentication', () => {
//   it('should SIGNUP a user', (done) => {
//     const user = {
//       firstname: 'Charles',
//       lastname: 'Mutagorama',
//       othername: '',
//       email: 'cmutagorama',
//       phone_number: '0781983488',
//       username: 'CharlyMuta',
//       password: 'password',
//       registered: moment(new Date()),
//     };
//     chai.request(app)
//       .post('/api/v1/auth/signup')
//       .send(user)
//       .end((err, res) => {
//         res.body.should.be.a('object');
//         res.body.should.have.property('status');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('array');
//         done();
//       });
//   });
// });
