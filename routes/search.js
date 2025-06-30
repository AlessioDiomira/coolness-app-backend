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
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [places] = await connection.query(
      "SELECT * FROM places WHERE name LIKE ? ORDER BY name ASC LIMIT 20",
      [`%${query}%`]
    );
    const [concepts] = await connection.query(
      "SELECT * FROM concepts WHERE name LIKE ? ORDER BY name ASC LIMIT 20",
      [`%${query}%`]
    );
    await connection.end();

    res.json({ places, concepts });
  } catch (error) {
    console.error('Errore durante la ricerca:', error);
    res.status(500).json({ error: 'Errore durante la ricerca' });
  }
});

module.exports = router;