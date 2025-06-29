const db = require('../db');

exports.getSummaryByPlace = (req, res) => {
  db.query('SELECT * FROM coolness_summary WHERE place_id = ?', [req.params.placeId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};