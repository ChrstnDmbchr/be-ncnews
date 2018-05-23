const express = require('express');
const router = express.Router();
const path = require('path')

const apiRoutes = require('./routes.json');

const articlesRoutes = require('./articlesRoutes');
const commentsRoutes = require('./commentsRoutes');
const topicsRoutes = require('./topicsRoutes');
const usersRoutes = require('./usersRoutes');

router.get('/', (req, res, next) => {
  res.render(path.join(__dirname, '../views', 'index.ejs'), {
    data: apiRoutes
  });
})

router.use('/topics', topicsRoutes);

router.use('/articles', articlesRoutes);

router.use('/comments', commentsRoutes);

router.use('/users', usersRoutes);

module.exports = router;