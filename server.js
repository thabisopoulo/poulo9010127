const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'Tp212476@.', // replace with your MySQL password
    database: 'wings_cafe_inventory' // replace with your MySQL database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Route to get all users
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Route to add a new user
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, username, password });
    });
});

// Route to delete a user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted', id });
    });
});

// Route to get all products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Route to add a new product
app.post('/api/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    if (!name || !category || price == null || quantity == null) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    const sql = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, category, price, quantity], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            id: result.insertId,
            name,
            description,
            category,
            price,
            quantity
        });
    });
});

const PORT = 5127;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
