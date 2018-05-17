exports.commentVote = (req, res, next) => {
  res.status(200).send({
    message: `PUT /api/comments/:comments_id with id ${req.params.comments_id}`,
    query: req.query
  })
}

exports.deleteComment = (req, res, next) => {
  res.status(200).send({
    message: `DELETE /api/comments/:comments_id with id ${req.params.comments_id}`
  })
}