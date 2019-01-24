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
          res.body.should.have.property('status').eql(201);
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
});