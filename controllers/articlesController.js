const models = require('../models/');

exports.getAllArticles = (req, res, next) => {
  models.Article.find({})
  .then(articles => {
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
    res.status(200).send(article);
  })
  .catch(err => {
    res.status(500).send(err);
  });
};

exports.getArticleComments = (req, res, next) => {
  models.Comment.find({belongs_to: req.params.article_id})
  .then(comments => {
    res.status(200).send({
      comments: comments
    });
  })
  .catch(err => {
    res.status(500).send(err);
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

  if (req.query.vote === 'up') {
    models.Article.findByIdAndUpdate({_id: req.params.article_id}, {$inc: {votes: 1}}, { new: true })
    .then(article => {
      res.status(201).send({
        message: "article vote up by 1!",
        vote_count: article.votes
      });
    })
    .catch(err => res.status(500).send(err));
  } else if (req.query.vote === 'down') {
    models.Article.findByIdAndUpdate({_id: req.params.article_id}, {$inc: {votes: -1}}, { new: true })
    .then(article => {
      res.status(201).send({
        message: "article vote down by 1!",
        vote_count: article.votes
      });
    })
    .catch(err => res.status(500).send(err));
  } else {
    res.status(400).send ({
      error: "please use only up/down with vote"
    });
  }; 
};