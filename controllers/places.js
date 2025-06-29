const db = require('../db');

exports.getAllPlaces = (req, res) => {
  db.query('SELECT * FROM places', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPlaceById = (req, res) => {
  db.query('SELECT * FROM places WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};