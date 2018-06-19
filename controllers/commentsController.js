const models = require('../models');

exports.commentVote = (req, res, next) => {
  if (!req.query.hasOwnProperty('vote')) {
    return next({status: 400, error: "invalid query, please user the 'vote' query followed by up/down"});
  };

  if(req.query.vote !== 'up' && req.query.vote !== 'down') {
    return next({status: 400, error: "invalid query, please user the 'vote' query followed by up/down"});
  }

  let vote;
  if (req.query.vote === 'up') vote = 1;
  else if (req.query.vote === 'down') vote = -1;

  models.Comment.findByIdAndUpdate(req.params.comments_id, {$inc: {votes: vote}}, { new: true })
  .then(comment => {
    if (!comment) {
      return next({status: 404, error: 'Comment not found'});
    };
    res.status(201).send({
      message: `article vote modified by ${vote}!`,
      vote_count: comment.votes
    });
  })
  .catch(err => next({status: 500, error: err}));
};

exports.deleteComment = (req, res, next) => {
  models.Comment.findByIdAndRemove(req.params.comments_id)
  .then(comment => {
    if (!comment) {
      return next({status: 404, error: 'Comment not found'});
    };
    res.status(200).send({
      message: "comment deleted",
      comment: comment
    });
  })
  .catch(err => next({status: 500, error: err}));
};