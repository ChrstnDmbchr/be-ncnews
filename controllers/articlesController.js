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
}

exports.getArticle = (req, res, next) => {
  models.Article.findById(req.params.article_id)
  .then(article => {
    res.status(200).send(article)
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

exports.getArticleComments = (req, res, next) => {
  res.status(200).send({
    message: `GET api/articles/:article_id/comments with id ${req.params.article_id} working`
  })
}

exports.addArticleComments = (req, res, next) => {
  res.status(200).send({
    message: `POST api/articles/:article_id/comments with id ${req.params.article_id} working`
  })
}

exports.articleVote = (req, res, next) => {
  res.status(200).send({
    message: `PUT api/articles/:article_id with id ${req.params.article_id}`,
    query: req.query
  })
}