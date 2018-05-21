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
  let articleId
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
      done();
    })
    .catch(err => {
      console.log(err);
    });
  });
  // Topics
  it('Topics - GET /api/topics', (done) => {
    request
    .get('/api/topics')
    .end((err, res) => {
      if (err) console.log(err);

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
      if (err) console.log(err);

      const articleTitles = res.body.articles.map(article => {
        return article.title;
      })

      expect(res.body.articles.length).to.equal(2);
      expect(articleTitles).to.have.members(["They're not exactly dogs, are they?", "UNCOVERED: catspiracy to bring down democracy"]);
      expect(Object.keys(res.body).length).to.equal(1)
      done();
    });
  });
  it('Topics - POST /api/topics/:topic_id/articles', (done) => {
    models.User.findOne({name: 'mitch'})
    .then(user => {
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
        if (err) console.log(err);

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
  // Articles
  it('Articles - GET /api/articles', (done) => {
    request
    .get('/api/articles')
    .end((err, res) => {
      if (err) console.log(err);
      articleId = res.body.articles[0]._id
      expect(Object.keys(res.body)).to.include('articles');
      expect(res.body.articles.length).to.equal(5);
      done();
    });
  });
  it('Articles - GET /api/articles/:article_id', (done) => {
    request
    .get(`/api/articles/${articleId}`)
    .end((err, res) => {
      if (err) console.log(err);
      expect(Object.keys(res.body).length).to.equal(7);
      expect(res.body.title).to.equal('Living in the shadow of a great man');
      done();
    })
  })
})