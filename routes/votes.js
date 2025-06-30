const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:placeId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT SUM(vote) AS total_votes, COUNT(*) AS count_votes
       FROM votes WHERE place_id = ?`,
      [req.params.placeId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei voti' });
  }
});

module.exports = router;