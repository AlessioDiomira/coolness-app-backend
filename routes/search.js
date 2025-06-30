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

router.get('/', async (req, res) => {
  const term = req.query.term;
  if (!term || term.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.query(
      `SELECT * FROM places WHERE name LIKE ? LIMIT 20`,
      [`%${term}%`]
    );
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('Search errore:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;