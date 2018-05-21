const express = require('express');
const router = express.Router();

const apiRoutes = require('./routes.json');

const articlesRoutes = require('./articlesRoutes');
const commentsRoutes = require('./commentsRoutes');
const topicsRoutes = require('./topicsRoutes');
const usersRoutes = require('./usersRoutes');

router.get('/', (req, res, next) => {
  // TODO html page
  // serves object containing all route info
  res.status(200).send(apiRoutes);
})

router.use('/topics', topicsRoutes);

router.use('/articles', articlesRoutes);

router.use('/comments', commentsRoutes);

router.use('/users', usersRoutes);

module.exports = router;