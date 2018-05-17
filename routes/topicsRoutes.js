const express = require('express');
const router = express.Router();

const { getAllTopics, getAllTopicArticles, postArticleTopic } = require('../controllers/topicsController');

router.get('/', getAllTopics);

router.get('/:topic_id/articles', getAllTopicArticles);

router.post('/:topic_id/articles', postArticleTopic);

module.exports = router;