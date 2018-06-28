const model = require('../models');

exports.getUser = (req, res, next) => {
  model.User.findOne({username: req.params.username})
  .then(async user => {
    if (!user) {
      return next({status: 404, error: 'user not found'});
    };
    const userArticles = await model.Article.find({created_by: user._id})
    res.status(200).send( {...user._doc, ...{articles: userArticles}} );
  })
  .catch(err => next({status: 500, error: err}));
};