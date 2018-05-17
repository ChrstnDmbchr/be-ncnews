exports.getAllArticles = (req, res, next) => {
  res.status(200).send({
    message: "GET /api/articles endpoint working"
  })
}

exports.getArticle = (req, res, next) => {
  res.status(200).send({
    message: `GET api/articles/:article_id with id ${req.params.article_id} working`
  })
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