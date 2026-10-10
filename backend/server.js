require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database.');
});

// Create tables (Entities: Users, Recipes)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      image_url TEXT,
      author_id INTEGER,
      FOREIGN KEY (author_id) REFERENCES users (id)
    )
  `);
});

// Dummy Minimoth OTP logic
// Since Minimoth API might not be accessible, we'll mock the actual request but structure it as requested.
const MINIMOTH_API_KEY = process.env.MINIMOTH_API_KEY;
const MINIMOTH_API_URL = process.env.MINIMOTH_API_URL || 'https://api.minimoth.com/v1';

// In-memory store for OTPs for simplicity in this workshop
const otpStore = new Map();

// Endpoint 1: Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  // Generate a 4 digit OTP - Hardcoded to 1234 for easy testing
  const otp = '1234';
  otpStore.set(phone, otp);

  try {
    // In a real scenario, we would send this via Minimoth API
    // await axios.post(`${MINIMOTH_API_URL}/otp/send`, { phone, otp }, { headers: { Authorization: `Bearer ${MINIMOTH_API_KEY}` } });
    console.log(`[Minimoth API Mock] Sent OTP ${otp} to ${phone}`);
    res.json({ message: 'OTP sent successfully (Check console for mock OTP)' });
  } catch (err) {
    console.error('Minimoth API error:', err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Endpoint 2: Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

  const storedOtp = otpStore.get(phone);
  if (storedOtp !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  // Create or get user
  db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row) {
      otpStore.delete(phone);
      return res.json({ token: row.id, user: row }); // Simple token for workshop
    } else {
      db.run('INSERT INTO users (phone) VALUES (?)', [phone], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        otpStore.delete(phone);
        res.json({ token: this.lastID, user: { id: this.lastID, phone } });
      });
    }
  });
});

// Endpoint 3: Get all recipes
app.get('/api/recipes', (req, res) => {
  db.all('SELECT recipes.*, users.phone as author_phone FROM recipes LEFT JOIN users ON recipes.author_id = users.id ORDER BY recipes.id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint 4: Create a recipe
app.post('/api/recipes', (req, res) => {
  const { title, ingredients, instructions, image_url, author_id } = req.body;
  if (!title || !ingredients || !instructions || !author_id) {
    return res.status(400).json({ error: 'All fields except image_url are required' });
  }

  const query = 'INSERT INTO recipes (title, ingredients, instructions, image_url, author_id) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [title, ingredients, instructions, image_url, author_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, title, ingredients, instructions, image_url, author_id });
  });
});

// Endpoint 5: Get recipe details
app.get('/api/recipes/:id', (req, res) => {
  db.get('SELECT recipes.*, users.phone as author_phone FROM recipes LEFT JOIN users ON recipes.author_id = users.id WHERE recipes.id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Recipe not found' });
    res.json(row);
  });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
