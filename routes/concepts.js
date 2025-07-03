const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

// GET /api/concepts/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await mysql.createConnection(dbConfig);

    const [[concept]] = await conn.query(
      'SELECT id, name, description FROM concepts WHERE id = ? LIMIT 1',
      [id]
    );

    if (!concept) {
      await conn.end();
      return res.status(404).json({ error: 'Concept not found' });
    }

    const [[rating]] = await conn.query(
      'SELECT AVG(rating) AS avg_rating FROM votes WHERE concept_id = ?',
      [id]
    );

    await conn.end();

    res.json({
      ...concept,
      avg_rating: rating.avg_rating || null
    });

  } catch (err) {
    console.error('Errore concept detail:', err);
    res.status(500).json({ error: 'Errore durante il recupero' });
  }
});

module.exports = router;