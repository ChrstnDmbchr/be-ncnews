process.env.NODE_ENV = 'test'

const { testUrl } = require('../dbconnection/index')
const mongoose = require('mongoose')
const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest')(app);
const dbSeed = require('../seed/seed');
const models = require('../models');

describe('API Endpoints', () => {
  // variables to keep track of id's
  let savedTopics
  let savedUsername
  let articleId
  let commentId
  // seed excecuted before all tests and values assigned to variables
  before(() => {
    return dbSeed(testUrl)
    .then(data => {
      [comments, articles, users, topics] = data
      savedUsername = users[1].username
      savedTopics = topics.filter(t => t.title === 'Cats');
      articleId = articles[0]._id
      commentId = comments[0]._id
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

  // Invalid route
  it('404 on invlad routes', () => {
    return request
    .get('/fake/route')
    .then(res => {
      expect(res.body).to.eql({
        "status": 404,
        "error": "route not found"
      });
      expect(res.status).to.equal(404)
    });
  });

  // Topics
  it('Topics - GET /api/topics', () => {
    return request
    .get('/api/topics')
    .then(res => {
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
  it('Topics - GET /api/topics/:topic_id/articles - 404', () => {
    return request
    .get('/api/topics/5b02d98661898f46f27048e5/articles')
    .then(res => {
      expect(res.status).to.equal(404);
      expect(res.body).to.eql({
        "status": 404,
        "error": "Topic not found"
      })
    })
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
  it('Topics - POST /api/topics/:topic_id/articles - invalid topic_id 400', () => {
    return request
    .post('/api/topics/5b02d98661898f46f27048g5/articles')
    .send({
      title: "this is a test title",
      body: "this is a test body"
    })
    .then(res => {
      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal(400)
      expect(res.body.error).to.be.a('object')
    });
  })


  //Articles
  it('Articles - GET /api/articles', () => {
    return request
    .get('/api/articles')
    .then(res => {
      expect(Object.keys(res.body)).to.include('articles');
      expect(res.body.articles.length).to.equal(5);
    });
  });
  it('Articles - GET /api/articles/:article_id', () => {
    return request
    .get(`/api/articles/${articleId}`)
    .then(res => {
      expect(typeof res.body).to.equal('object');
      expect(Object.keys(res.body).length).to.equal(6);
      expect(res.body.title).to.equal('Living in the shadow of a great man');
    });
  });
  it('Articles -GET /api/articles/:article_id - invalid article_id 404', () => {
    return request
    .get('/api/articles/6b02d98661898f46f27048e1')
    .then(res => {
      expect(res.status).to.equal(404);
      expect(res.body).to.eql({
        status: 404,
        error: "Article not found"
      })
    })
  })
  it('Articles - GET /api/articles/:article_id/comments', () => {
    return request
    .get(`/api/articles/${articleId}/comments`)
    .then(res => {
      expect(res.body.comments.length).to.equal(2);
      expect(Array.isArray(res.body.comments)).to.be.true;
    });
  });
  it('Articles - GET /api/articles/:article_id/comments - invalid article_id 404', () => {
    return request
    .get('/api/articles/6b02d98661898f46f27048ef/comments')
    .then(res => {
      expect(res.body.error).to.equal('Article not found');
      expect(res.status).to.equal(404)
    });
  })
  it('Articles - POST /api/articles/:article_id/comments', () => {
    return request
    .post(`/api/articles/${articleId}/comments`)
    .send({
      comment: "this is a test comment",
    })
    .then(res => {
      expect(res.body.message).to.equal('comment created');
      expect(res.body.comment.body).to.equal('this is a test comment');
    });
  });
  it('Articles - POST /api/articles/:article_id/comments - invalid article_id 400', () => {
    return request
    .post(`/api/articles/6b02d98661898f46f270482k6/comments`)
    .send({
      body: "this is a test comment",
    })
    .then(res => {
      expect(res.status).to.equal(400);
      expect(res.body.error).to.be.a('object');
    });
  });
  it('Articles - PUT /api/articles/:article_id - vote up', () => {
    return request
    .put(`/api/articles/${articleId}?vote=up`)
    .then(res => {
      expect(res.body.vote_count).to.equal(1);
    });
  });
  it('Articles - PUT /api/articles/:article_id - vote down', () => {
    return request
    .put(`/api/articles/${articleId}?vote=down`)
    .then(res => {
      expect(res.body.vote_count).to.equal(0);
    });
  });
  it('Articles - PUT /api/articles/:article_id - vote query not used 400', () => {
    return request
    .put(`/api/articles/${articleId}?test=down`)
    .then(res => {
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("invalid query, please user the 'vote' query followed by up/down")
    });
  });
  it('Articles - PUT /api/articles/:article_id - vote property not up/down 400', () => {
    return request
    .put(`/api/articles/${articleId}?vote=test`)
    .then(res => {
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("invalid query, please user the 'vote' query followed by up/down")
    });
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
  it('Comments - PUT /api/comments/:comment_id - vote query not used 400', () => {
    return request
    .put(`/api/comments/${commentId}?test=up`)
    .then(res => {
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("invalid query, please user the 'vote' query followed by up/down")
    });
  });
  it('Comments - PUT /api/comments/:comment_id - vote property not up/down 400', () => {
    return request
    .put(`/api/comments/${commentId}?vote=test`)
    .then(res => {
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("invalid query, please user the 'vote' query followed by up/down")
    });
  });
  it('Comments - DELETE /api/comments/:comment_id', () => {
    return request
    .delete(`/api/comments/${commentId}`)
    .then(res => {
      expect(res.body.comment._id).to.equal(`${commentId}`);
      expect(res.body.message).to.equal('comment deleted');
      expect(res.status).to.equal(200);
    });
  });
  it('Comments - DELETE /api/comments/:comment_id - invalid comment_id 404', () => {
    return request
    .delete('/api/comments/6b02d98661898f46f2704097')
    .then(res => {
      expect(res.body).to.eql({
        "status": 404,
        "error": "Comment not found"
      });
      expect(res.status).to.equal(404);
    });
  })

  // Users
  it('Users - GET /api/users/:username', () => {
    return request
    .get(`/api/users/${savedUsername}`)
    .then(res => {
      expect(res.body.name).to.equal('mitch');
      expect(res.body.username).to.equal(savedUsername);
      expect(res.body.articles).to.be.an('array')
    });
  });
  it('Users - GET /api/users/:username - invalid username 404', () => {
    return request
    .get(`/api/users/testusername`)
    .then(res => {
      expect(res.body).to.eql({status: 404, error: 'user not found'});
      expect(res.status).to.equal(404);
    });
  });
});