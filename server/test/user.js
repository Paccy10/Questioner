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
    db.addUser();
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
          res.body.data.should.all.have.property('token');
          res.body.data.should.all.have.property('user');
          done();
        });
    });

    it('should Login a user', (done) => {
      const user = {
        username: 'Paccy10',
        password: 'password',
      };
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.should.all.have.property('token');
          res.body.data.should.all.have.property('user');
          done();
        });
    });
  });
});
