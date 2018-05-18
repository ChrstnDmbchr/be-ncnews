process.env.NODE_ENV = 'test'

const { testUrl } = require('../dbconnection/index')
const mongoose = require('mongoose')
const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest')(app);
const dbSeed = require('../seed/seed');

describe('API Endpoints', () => {
  // seed excecuted before all tests
  before(done => {
    dbSeed(testUrl)
    .then(() => {
      console.log('seeding complete')
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
  // disconnect from DB after all tests
  after(done => {
    mongoose.disconnect()
    .then(() => {
      console.log(`tests completed, disconnected from ${process.env.NODE_ENV} db`);
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
  // test
  it('Topics - GET /api/topics', (done) => {
    request
    .get('/api/topics')
    .end((err, res) => {
      const topicTitles = res.body.topics.map(topic => {
        return topic.title;
      })
      expect(res.body.topics.length).to.equal(2);
      expect(res.status).to.equal(200);
      expect(topicTitles).to.have.members(['Mitch', 'Cats'])
      done();
    })
  })
})