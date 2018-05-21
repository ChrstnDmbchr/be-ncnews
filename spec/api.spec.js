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
  let commentId
  // seed excecuted before all tests
  before(() => {
    return dbSeed(testUrl)
    .then(() => {
      console.log('seeding complete')
    })
    .catch(err => {
      console.log(err);
    });
  });
  // disconnect from DB after all tests
  after(() => {
    return mongoose.disconnect()
    .catch(err => {
      console.log(err);
    });
  });

  // Topics
  it('Topics - GET /api/topics', () => {
    return request
    .get('/api/topics')
    .then(res => {
      savedTopics = res.body.topics.filter(t => t.title === 'Cats');

      const topicTitles = res.body.topics.map(topic => {
        return topic.title;
      })

      expect(res.body.topics.length).to.equal(2);
      expect(res.status).to.equal(200);
      expect(topicTitles).to.have.members(['Mitch', 'Cats']);
      expect(Object.keys(res.body)).to.eql(['topics'])
    });
  });
  it('Topics - GET /api/topics/:topic_id/articles', () => {
    return request
    .get(`/api/topics/${savedTopics[0]._id}/articles`)
    .then(res => {
      const articleTitles = res.body.articles.map(article => {
        return article.title;
      })

      expect(res.body.articles.length).to.equal(2);
      expect(articleTitles).to.have.members(["They're not exactly dogs, are they?", "UNCOVERED: catspiracy to bring down democracy"]);
      expect(Object.keys(res.body).length).to.equal(1)
    });
  });
  it('Topics - POST /api/topics/:topic_id/articles', () => {
    return request
    .post(`/api/topics/${savedTopics[0]._id}/articles`)
    .send({
      title: "this is a test title",
      body: "this is a test body",
    })
    .then(res => {
      expect(res.body.article.title).to.equal("this is a test title");
      expect(res.body.article.body).to.equal("this is a test body");
      expect(res.status).to.equal(201);
    });
  });

  //Articles
  it('Articles - GET /api/articles', () => {
    return request
    .get('/api/articles')
    .then(res => {
      articleId = res.body.articles[0]._id
      expect(Object.keys(res.body)).to.include('articles');
      expect(res.body.articles.length).to.equal(5);
    });
  });
  it('Articles - GET /api/articles/:article_id', () => {
    return request
    .get(`/api/articles/${articleId}`)
    .then(res => {
      expect(typeof res.body).to.equal('object');
      expect(Object.keys(res.body).length).to.equal(7);
      expect(res.body.title).to.equal('Living in the shadow of a great man');
    });
  });
  it('Articles - GET /api/articles/:article_id/comments', () => {
    return request
    .get(`/api/articles/${articleId}/comments`)
    .then(res => {
      commentId = res.body.comments[0]._id
      expect(res.body.comments.length).to.equal(2);
      expect(Array.isArray(res.body.comments)).to.be.true;
    });
  });
  it('Articles - POST /api/articles/:article_id/comments', () => {
    return request
    .post(`/api/articles/${articleId}/comments`)
    .send({
      body: "this is a test comment",
    })
    .then(res => {
      expect(res.body.message).to.equal('comment created');
      expect(res.body.comment.body).to.equal('this is a test comment');
    });
  });
  it('Articles - PUT /api/articles/:article_id - vote up', () => {
    return request
    .put(`/api/articles/${articleId}?vote=up`)
    .then(res => {
      expect(res.body.vote_count).to.equal(1);
    })
  });
  it('Articles - PUT /api/articles/:article_id - vote down', () => {
    return request
    .put(`/api/articles/${articleId}?vote=down`)
    .then(res => {
      expect(res.body.vote_count).to.equal(0);
    })
  });

  //Comments
  it('Comments - PUT /api/comments/:comment_id - vote up', () => {
    return request
    .put(`/api/comments/${commentId}?vote=up`)
    .then(res => {
      expect(res.body.vote_count).to.equal(8);
    });
  });
  it('Comments - PUT /api/comments/:comment_id - vote down', () => {
    return request
    .put(`/api/comments/${commentId}?vote=down`)
    .then(res => {
      expect(res.body.vote_count).to.equal(7);
    });
  });
  
});