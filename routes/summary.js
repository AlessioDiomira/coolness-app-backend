const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary');

router.get('/:placeId', summaryController.getSummaryByPlace);

module.exports = router;