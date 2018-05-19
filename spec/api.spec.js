process.env.NODE_ENV = 'test'

const { testUrl } = require('../dbconnection/index')
const mongoose = require('mongoose')
const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest')(app);
const dbSeed = require('../seed/seed');
const models = require('../models');

describe('API Endpoints', () => {
  // var to keep track of id's
  let savedTopics
  let userId
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
      savedTopics = res.body.topics.filter(t => t.title === 'Cats');

      const topicTitles = res.body.topics.map(topic => {
        return topic.title;
      })

      expect(res.body.topics.length).to.equal(2);
      expect(res.status).to.equal(200);
      expect(topicTitles).to.have.members(['Mitch', 'Cats']);
      expect(Object.keys(res.body)).to.eql(['topics'])
      done();
    });
  });
  it('Topics - GET /api/topics/:topic_id/articles', (done) => {
    request
    .get(`/api/topics/${savedTopics[0]._id}/articles`)
    .end((err, res) => {
      const articleTitles = res.body.articles.map(article => {
        return article.title;
      })
      expect(res.body.articles.length).to.equal(2);
      expect(articleTitles).to.have.members(["They're not exactly dogs, are they?", "UNCOVERED: catspiracy to bring down democracy"]);
      expect(Object.keys(res.body).length).to.equal(1)
      done();
    });
  });
  it('TOPICS - POST /api/topics/:topic_id/articles', (done) => {
    models.User.findOne({name: 'mitch'}).then(user => {
      userId = user._id
      return Promise.all([])
    })
    .then(() => {
      request
      .post(`/api/topics/${savedTopics[0]._id}/articles`)
      .send({
        title: "this is a test title",
        body: "this is a test body",
        // including userId for now to get around it being a required field
        user_id: userId
      })
      .end((err, res) => {
        expect(res.body.article.title).to.equal("this is a test title");
        expect(res.body.article.body).to.equal("this is a test body");
        expect(res.body.article.created_by).to.equal(`${userId}`);
        expect(res.status).to.equal(201);
        models.Article.count({title: "this is a test title", body: "this is a test body"})
        .then(count => {
          expect(count).to.equal(1);
        })
        .catch(err => {
          console.log(err);
        })
        done();
      })
    })
    .catch(err => console.log(err));
  })
})