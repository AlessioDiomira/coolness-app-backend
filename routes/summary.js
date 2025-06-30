const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');

router.get('/:id', async (req, res) => {
  try {
    const [conceptRows] = await db.query('SELECT * FROM concepts WHERE id = ?', [req.params.id]);
    if (conceptRows.length === 0) {
      return res.status(404).json({ error: 'Concetto non trovato' });
    }

    const concept = conceptRows[0].name;
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(concept)}`;

    const wikiResponse = await axios.get(wikiUrl);
    const summary = wikiResponse.data.extract || 'Nessuna descrizione trovata.';

    res.json({
      id: req.params.id,
      name: concept,
      summary,
    });
  } catch (error) {
  res.status(500).json({ error: 'Errore durante il recupero del concetto' });
}
});

module.exports = router;