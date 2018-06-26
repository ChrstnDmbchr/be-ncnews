const mongoose = require('mongoose');
const models = require('../models');

exports.getAllTopics = (req, res, next) => {
  models.Topic.find({})
  .then(topics => {
    if (!topics.length) {
      return next({status: 404, error: 'No Topics found'});
    }

    res.status(200).send({ topics });
  })
  .catch(err => next({status: 500, error: err}));
};

exports.getAllTopicArticles = (req, res, next) => {
  models.Article.aggregate([
    { $match: {belongs_to: mongoose.Types.ObjectId(req.params.topic_id)}},
    { $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'belongs_to',
      as: 'comments'
    }},
    { $lookup: {
      from: 'users',
      localField: 'created_by',
      foreignField: '_id',
      as: 'created_by'
    }},
    { $lookup: {
      from: 'topics',
      localField: 'belongs_to',
      foreignField: '_id',
      as: 'belongs_to'
    }},
    { $unwind: '$created_by'},
    { $unwind: '$belongs_to'},
    { $project: {
      votes: '$votes',
      title: '$title',
      created_by: '$created_by.username',
      body: '$body',
      belongs_to: '$belongs_to.title',
      comment_count: {$size: '$comments'}
    }}
  ])
  .then(articles => {
    if (!articles.length) {
      return next({status: 404, error: 'Topic not found'});
    }

    res.status(200).send({ articles });

  })
  .catch(err => next({status: 500, error: err}));
};

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
    .catch(err => next({status: 400, error: err}));
  });
};