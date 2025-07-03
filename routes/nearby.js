const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);

    const [rows] = await conn.execute(
      `
      SELECT *, (
        6371 * acos(
          cos(radians(?)) * cos(radians(lat)) *
          cos(radians(lng) - radians(?)) +
          sin(radians(?)) * sin(radians(lat))
        )
      ) AS distance
      FROM places
      HAVING distance < 5
      ORDER BY distance;
      `,
      [lat, lng, lat]
    );

    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('Errore query nearby:', err.message);
    res.status(500).json({ error: 'Errore durante la ricerca dei luoghi vicini' });
  }
});

module.exports = router;