const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const db = require('../db');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT *, 0 AS avg_rating FROM places WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Non trovato' });
    res.json(rows[0]);
  } catch (e) {
    console.error('Errore detail:', e);
    res.status(500).json({ error: 'Errore server' });
  }
});

module.exports = router;