exports.getAllTopics = (req, res, next) => {
  res.status(200).send({
    message: "GET /api/topics enpoint working"
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