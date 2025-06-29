const db = require('../db');

exports.submitVote = (req, res) => {
  const { user_id, vote, comment } = req.body;
  db.query('INSERT INTO coolness_votes (place_id, user_id, vote, comment) VALUES (?, ?, ?, ?)',
    [req.params.placeId, user_id, vote, comment],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Vote recorded' });
    });
};

exports.getVotesByPlace = (req, res) => {
  db.query('SELECT * FROM coolness_votes WHERE place_id = ?', [req.params.placeId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};