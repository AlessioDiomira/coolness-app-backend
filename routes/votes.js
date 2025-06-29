const express = require('express');
const router = express.Router();
const votesController = require('../controllers/votes');

router.post('/:placeId', votesController.submitVote);
router.get('/:placeId', votesController.getVotesByPlace);

module.exports = router;