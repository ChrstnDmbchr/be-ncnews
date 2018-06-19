const models = require('../models');

exports.commentVote = (req, res, next) => {
  if (!Object.keys(req.query).includes('vote')) {
    return res.status(400).send({
      error: "invalid query, please user the 'vote' query followed by up/down"
    });
  };
  let vote
  if (req.query.vote === 'up') vote = 1
  else if (req.query.vote === 'down') vote = -1

  models.Comment.findByIdAndUpdate({_id: req.params.comments_id}, {$inc: {votes: vote}}, { new: true })
  .then(comment => {
    res.status(201).send({
      message: `article vote modified by ${vote}!`,
      vote_count: comment.votes
    });
  })
  .catch(err => next({status: 500, error: err}));
};

exports.deleteComment = (req, res, next) => {
  models.Comment.findByIdAndRemove({_id: req.params.comments_id})
  .then(comment => {
    res.status(200).send({
      message: "comment deleted",
      comment: comment
    })
  })
  .catch(err => next({status: 500, error: err}));
};