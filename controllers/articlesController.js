const models = require('../models/');
const mongoose = require('mongoose')

exports.getAllArticles = (req, res, next) => {
  models.Article.aggregate([
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
    if (articles.length === 0) {
      return next({status: 404, error: 'Articles not found'});
    }

    res.status(200).send({
      articles: articles
    });
  })
  .catch(err => {
    res.status(500).send(err)
  });
};

exports.getArticle = (req, res, next) => {
  models.Article.findById(req.params.article_id)
  .then(article => {
    if (article === null) {
      return next({status: 404, error: 'Article not found'});
    }

    res.status(200).send(article);
  })
  .catch(err => {
    next({status: 400, error: err});
  });
};

exports.getArticleComments = (req, res, next) => {
  models.Comment.find({belongs_to: req.params.article_id})
  .then(comments => {
    if (comments.length === 0) {
      return next({status: 404, error: 'Comments not found'});
    }

    res.status(200).send({
      comments: comments
    });
  })
  .catch(err => {
    next({status: 400, error: err});
  });
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
  .catch(err => {
    res.status(500).send(err);
  });
};

exports.articleVote = (req, res, next) => {
  if (!Object.keys(req.query).includes('vote')) {
    return res.status(400).send({
      error: "invalid query, please user the 'vote' query followed by up/down"
    });
  };

  let vote
  if (req.query.vote === 'up') vote = 1
  else if (req.query.vote === 'down') vote = -1

  models.Article.findByIdAndUpdate({_id: req.params.article_id}, {$inc: {votes: vote}}, { new: true })
  .then(article => {
     res.status(201).send({
      message: `article vote modified by ${vote}!`,
      vote_count: article.votes
    });
  })
  .catch(err => res.status(500).send(err));
  
};