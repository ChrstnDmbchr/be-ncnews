const express = require('express');
const router = express.Router();

const { getAllArticles, getArticle, getArticleComments, addArticleComments, articleVote } = require('../controllers/articlesController');

router.get('/', getAllArticles);

router.get('/:article_id', getArticle);

router.get('/:article_id/comments', getArticleComments);

router.post('/:article_id/comments', addArticleComments);

router.put('/:article_id', articleVote);

module.exports = router;