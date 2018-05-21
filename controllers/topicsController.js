const mongoose = require('mongoose');
const models = require('../models');

exports.getAllTopics = (req, res, next) => {
  models.Topic.find({})
  .then(topics => {
    res.status(200).send({
      topics: topics
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

exports.getAllTopicArticles = (req, res, next) => {
  models.Article.find({belongs_to: `${req.params.topic_id}`})
  .then(articles => {
    res.status(200).send({
      articles: articles
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

exports.postArticleTopic = (req, res, next) => {
  // added to hack created_by value TODO: replace when user auth is added 
  models.User.findOne({name: 'mitch'})
  .then(user => {
    models.Article.create({
      title: req.body.title,
      body: req.body.body,
      belongs_to: req.params.topic_id,
      // user id from db call here
      created_by: user._id
    })
    .then(result => {
      res.status(201).send({
        message: "article created",
        article: result
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
  })
}