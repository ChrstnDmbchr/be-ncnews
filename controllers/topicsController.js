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
  models.Article.aggregate([
    { $match: {belongs_to: mongoose.Types.ObjectId(req.params.topic_id)}},
    { $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'belongs_to',
      as: 'comments'
    }},
    { $project: {
      votes: '$votes',
      title: '$title',
      created_by: '$created_by',
      body: '$body',
      belongs_to: '$belongs_to',
      comment_count: {$size: '$comments'},
      __v: '$__v'
    }}
  ])
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