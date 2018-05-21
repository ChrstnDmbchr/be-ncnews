const models = require('../models');

exports.commentVote = (req, res, next) => {
  if (!Object.keys(req.query).includes('vote')) {
    return res.status(400).send({
      error: "invalid query, please user the 'vote' query followed by up/down"
    });
  };

  if (req.query.vote === 'up') {
    models.Comment.findByIdAndUpdate({_id: req.params.comments_id}, {$inc: {votes: 1}}, { new: true })
    .then(comment => {
      res.status(201).send({
        message: "comment vote up by 1!",
        vote_count: comment.votes
      });
    })
    .catch(err => res.status(500).send(err));
  } else if (req.query.vote === 'down') {
    models.Comment.findByIdAndUpdate({_id: req.params.comments_id}, {$inc: {votes: -1}}, { new: true })
    .then(comment => {
      res.status(201).send({
        message: "comment vote down by 1!",
        vote_count: comment.votes
      });
    })
    .catch(err => res.status(500).send(err));
  } else {
    res.status(400).send ({
      error: "please use only up/down with vote"
    });
  }; 
}

exports.deleteComment = (req, res, next) => {
  models.Comment.findByIdAndRemove({_id: req.params.comments_id})
  .then(comment => {
    res.status(200).send({
      message: "comment deleted",
      comment: comment
    })
  })
  .catch(err => {
    res.status(500).send(err);
  });
};