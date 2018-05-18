if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
const models = require('../models');

const dbConnection = require('../dbconnection')

const articleData = require(`./${process.env.NODE_ENV}Data/articles`);
const commentData = require(`./${process.env.NODE_ENV}Data/comments`);
const topicData = require(`./${process.env.NODE_ENV}Data/topics`);
const userData = require(`./${process.env.NODE_ENV}Data/users`);

function dbSeed (dbUrl) {
  mongoose.connect(dbUrl);
  mongoose.connection.dropDatabase()
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
      article.vote = 0;
  
      delete article.topic;
      return article
    });

    return Promise.all([models.Article.insertMany(ARTICLES), users])
  })
  .then(([articles, users]) => {
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

    return models.Comment.insertMany(COMMENTS);
  })
  .then(() => {
    console.log(`${process.env.NODE_ENV} Comments seeded`);
    mongoose.disconnect();
    console.log(`disconnected from ${process.env.NODE_ENV} db, seeding complete`);
  })
  .catch(err => {
    console.log(err);
  });
};


if (process.env.NODE_ENV === 'test') {
  dbSeed(dbConnection.testUrl);
} else if (process.env.NODE_ENV === 'dev') {
  dbSeed(dbConnection.devUrl);
}

module.exports = dbSeed;