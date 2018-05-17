const express = require('express');
const router = express.Router();

const articlesRoutes = require('./articlesRoutes');
const commentsRoutes = require('./commentsRoutes');
const topicsRoutes = require('./topicsRoutes');
const usersRoutes = require('./usersRoutes');

router.get('/', (req, res, next) => {
  res.status(200).send({
    message: "GET /api working"
  });
})

router.use('/topics', topicsRoutes);

router.use('/articles', articlesRoutes);

router.use('/comments', commentsRoutes);

router.use('/users', usersRoutes);

module.exports = router;