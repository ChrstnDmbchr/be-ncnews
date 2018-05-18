process.env.NODE_ENV = 'test'

const { testUrl } = require('../dbconnection/index')
const mongoose = require('mongoose')
const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest')(app);
const dbSeed = require('../seed/seed');

describe('API Endpoints', () => {
  // seed excecuted before tests
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
  // disconnect from DB after tests
  after(done => {
    mongoose.disconnect()
    .then(() => {
      console.log(`disconnected from ${process.env.NODE_ENV} db`);
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
  // test
  it('test working', (done) => {
    done();
  })
})