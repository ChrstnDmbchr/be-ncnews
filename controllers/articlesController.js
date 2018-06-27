const mongoose = require('mongoose');
const models = require('../models/');

exports.getAllArticles = (req, res, next) => {
  models.Article.aggregate([
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
      created_by: {
        username: '$created_by.username',
        id: '$created_by._id'
      },
      body: '$body',
      belongs_to: {
        title: '$belongs_to.title',
        id: '$belongs_to._id'
      },
      comment_count: {$size: '$comments'}
    }}
  ])
  .then(articles => {
    if (!articles.length) {
      return next({status: 404, error: 'Articles not found'});
    };


    res.status(200).send({ articles });
  })
  .catch(err => next({status: 500, error: err}));
};

exports.getArticle = (req, res, next) => {
  models.Article.aggregate([
    { $match: {_id: mongoose.Types.ObjectId(req.params.article_id)}},
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
    { $unwind: '$belongs_to'},
    { $unwind: '$created_by'},
    { $project: {
      votes: '$votes',
      _id: '$_id',
      body: '$body',
      title: '$title',
      belongs_to: '$belongs_to.title',
      created_by: '$created_by.username'
    }}
  ])
  .then(([ article ]) => {
    if (!article) {
      return next({status: 404, error: 'Article not found'});
    };

    res.status(200).send(article);
  })
  .catch(err => next({status: 400, error: err}));
};

exports.getArticleComments = (req, res, next) => {
  models.Comment.aggregate([
    { $match: {belongs_to: mongoose.Types.ObjectId(req.params.article_id)}},
    { $lookup: {
      from: 'users',
      localField: 'created_by',
      foreignField: '_id',
      as: 'created_by'
    }},
    { $unwind: '$created_by'},
    { $project: {
      created_at: '$created_at',
      votes: '$votes',
      _id: '$_id',
      body: '$body',
      belongs_to: '$belongs_to',
      created_by: '$created_by.username'
    }}
  ])
  .then(comments => {
    if (!comments.length) {
      return next({status: 404, error: 'Article not found'});
    };

    res.status(200).send({ comments });
  })
  .catch(err => next({status: 400, error: err}));
};

exports.addArticleComments = (req, res, next) => {
  // added to hack created_by value TODO: replace when user auth is added
  models.User.findOne({name: 'mitch'})
  .then(user => {
    return models.Comment.create({
      body: req.body.body,
      belongs_to: req.params.article_id,
      // user id from db call here
      created_by: user._id
    });
  })
  .then(comment => {
    res.status(201).send({
      message: 'comment created',
      comment: comment
    });
  })
  .catch(err => next({status: 400, error: err}));
};

exports.articleVote = (req, res, next) => {
  if (!req.query.hasOwnProperty('vote')) {
    return next({status: 400, error: "invalid query, please user the 'vote' query followed by up/down"});
  };

  if(req.query.vote !== 'up' && req.query.vote !== 'down') {
    return next({status: 400, error: "invalid query, please user the 'vote' query followed by up/down"});
  }

  let vote;
  if (req.query.vote === 'up') vote = 1;
  else if (req.query.vote === 'down') vote = -1;

  models.Article.findByIdAndUpdate({_id: req.params.article_id}, {$inc: {votes: vote}}, { new: true })
  .then(article => {
    if (!article) {
      return next({status: 404, error: 'Article not found'});
    };

    res.status(201).send({
      message: `article vote modified by ${vote}!`,
      vote_count: article.votes
    });
  })
  .catch(err => next({status: 500, error: err}));
};