const chai = require('chai');

const chaiHttp = require('chai-http');

const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Meetups', () => {
  it('should GET all the meetups', (done) => {
    chai.request(app)
      .get('/api/v1/meetups')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });

  it('should GET all the upcoming meetups', (done) => {
    chai.request(app)
      .get('/api/v1/meetups/upcoming')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });

  it('should POST a meetup', (done) => {
    const meetup = {
      createdOn: '03-01-2019',
      location: 'Telecom House',
      images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
      topic: 'Nodejs Meetup',
      happeningOn: '20-01-2019',
      tags: ['Javascript', 'Programming'],
    };
    chai.request(app)
      .post('/api/v1/meetups')
      .send(meetup)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });

  it('should GET a meetup with the given id', (done) => {
    const meetup = {
      id: 1,
      createdOn: '03-01-2019',
      location: 'Telecom House',
      images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
      topic: 'Nodejs Meetup',
      happeningOn: '20-01-2019',
      tags: ['Javascript', 'Programming'],
    };
    chai.request(app)
      .get('/api/v1/meetups/' + meetup.id)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });

  it('it should POST an Rsvp on a meetup', (done) => {
    const meetup = {
      id: 1,
      createdOn: '03-01-2019',
      location: 'Telecom House',
      images: ['http://tourer.ewco.se/wp-content/uploads/2012/12/rwanda-telecom-house-SMALL-500x376.jpg', 'https://er.educause.edu/~/media/images/articles/2015/3/ero1539image1.jpg'],
      topic: 'Nodejs Meetup',
      happeningOn: '20-01-2019',
      tags: ['Javascript', 'Programming'],
    };

    const rsvp = {
      id: 1,
      meetup: meetup.id,
      user: 1,
      response: 'yes',
    };
    chai.request(app)
      .post('/api/v1/meetups/' + meetup.id + '/rsvps')
      .send(rsvp)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });
});

describe('Questions', () => {
  it('should POST a question', (done) => {
    const question = {
      id: 1,
      createdOn: '03-01-2019',
      createdBy: 1,
      meetup: 1,
      title: 'Can I bring my laptop',
      body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
      votes: 5,
    };
    chai.request(app)
      .post('/api/v1/questions')
      .send(question)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });

  it('should UPDATE(increase) the number of votes of a question with the given id', (done) => {
    const question = {
      id: 1,
      createdOn: '03-01-2019',
      createdBy: 1,
      meetup: 1,
      title: 'Can I bring my laptop',
      body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
      votes: 5,
    };
    chai.request(app)
      .patch('/api/v1/questions/' + question.id + '/upvote')
      .send({
        id: 1,
        createdOn: '03-01-2019',
        createdBy: 1,
        meetup: 1,
        title: 'Can I bring my laptop',
        body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
        votes: question.votes + 1,
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });

  it('it should UPDATE(decrease) the number of votes of a question with the given id', (done) => {
    const question = {
      id: 1,
      createdOn: '03-01-2019',
      createdBy: 1,
      meetup: 1,
      title: 'Can I bring my laptop',
      body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
      votes: 5,
    };
    chai.request(app)
      .patch('/api/v1/questions/' + question.id + '/upvote')
      .send({
        id: 1,
        createdOn: '03-01-2019',
        createdBy: 1,
        meetup: 1,
        title: 'Can I bring my laptop',
        body: 'Hello Andela! I would like to ask you if there is no problem to bring my latop in the bootcamp?',
        votes: question.votes - 1,
      })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });
});
