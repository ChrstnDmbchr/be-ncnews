const model = require('../models');

exports.getUser = (req, res, next) => {
  model.User.findOne({username: req.params.username})
  .then(user => {
    res.status(200).send(user);
  })
  .catch(err => next({status: 500, error: err}));
};