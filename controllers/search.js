const db = require('../db');

exports.searchAll = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Parametro di ricerca mancante' });

  const sqls = [
    { table: 'places', lat: 'lat', lng: 'lng' },
    { table: 'concepts' },
    { table: 'brands' },
    { table: 'institutions' },
    { table: 'parties' }
  ];

  const results = [];

  try {
    for (const { table, lat, lng } of sqls) {
      const [rows] = await db.query(`SELECT id, name${lat ? ", "+lat+", "+lng : ''} FROM ${table} WHERE name LIKE ?`, [`%${query}%`]);
      rows.forEach(row => {
        results.push({ tipo: table, ...row });
      });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};