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
  const article = new models.Article({
    title: req.body.title,
    body: req.body.body,
    belongs_to: req.params.topic_id,
    // created_by added for now to get around it being a required field, user_id included in body
    created_by: req.body.user_id
  })
  .save()
  .then(result => {
    res.status(201).send({
      message: "article created",
      article: result
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
}