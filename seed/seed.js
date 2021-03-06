if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const models = require('../models');

const articleData = require(`./${process.env.NODE_ENV}Data/articles`);
const commentData = require(`./${process.env.NODE_ENV}Data/comments`);
const topicData = require(`./${process.env.NODE_ENV}Data/topics`);
const userData = require(`./${process.env.NODE_ENV}Data/users`);

function dbSeed (dbUrl) {
  return mongoose.connection.dropDatabase()
  .then(() => {
    console.log(`${process.env.NODE_ENV} db dropped`);
    return Promise.all([models.User.insertMany(userData), models.Topic.insertMany(topicData)])
  })
  .then(([users, topics]) => {
    console.log(`${process.env.NODE_ENV} Users and Topics seeded`);
    
    const ARTICLES = articleData.map(article => {
      const topicId = topics.find(topic => {
        return topic.slug === article.topic;
      })._id;
  
      const userId = users.find(user => {
        return user.username === article.created_by;
      })._id;
  
      article.belongs_to = topicId;
      article.created_by = userId;
  
      return article
    });

    return Promise.all([models.Article.insertMany(ARTICLES), users, topics])
  })
  .then(([articles, users, topics]) => {
    console.log(`${process.env.NODE_ENV} Articles seeded`);

    const COMMENTS = commentData.map(comment => {
      const articleId = articles.find(article => {
        return article.title === comment.belongs_to;
      })._id;
  
      const userId = users.find(user => {
        return comment.created_by === user.username;
      })._id;
  
      comment.belongs_to = articleId;
      comment.created_by = userId;

      return comment
    });

    return Promise.all([models.Comment.insertMany(COMMENTS), articles, users, topics])
  })
  .then(data => {
    console.log(`${process.env.NODE_ENV} Comments seeded`);
    return data
  })
  .catch(err => {
    console.log(err);
  });
};

module.exports = dbSeed;