const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

const placesRoutes = require('./routes/places');
const votesRoutes = require('./routes/votes');
const summaryRoutes = require('./routes/summary');
const nearbyRoutes = require('./routes/nearby');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/places', placesRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/summary', summaryRoutes);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.use('/api/places/nearby', nearbyRoutes);
const auth = require('./auth');

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  db.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hash], err => {
    if (err) return res.status(500).send(err);
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).send('User not found');
    const user = results[0];
    if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).send('Invalid password');
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

app.get('/api/user/profile', auth, (req, res) => {
  res.send({ email: req.user.email });
});

app.listen(3001, () => console.log('Server on port 3001'));

// ...
