const express = require('express');
const router = express.Router();

const { commentVote, deleteComment } = require('../controllers/commentsController');

router.put('/:comments_id', commentVote);

router.delete('/:comments_id', deleteComment);

module.exports = router;