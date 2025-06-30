const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/places/nearby?lat=...&lng=...
router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const [rows] = await db.execute(
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

    res.json(rows);
  } catch (err) {
    console.error('Errore query nearby:', err);
    res.status(500).json({ error: 'Errore durante la ricerca dei luoghi vicini' });
  }
});

module.exports = router;