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
  res.status(200).send({
    message: `GET /api/topics enpoint working with topic_id ${req.params.topic_id}`
  })
}

exports.postArticleTopic = (req, res, next) => {
  res.status(200).send({
    message: `POST /api/topics enpoint working with topic_id ${req.params.topic_id}`
  })
}