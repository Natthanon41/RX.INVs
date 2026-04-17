const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3308,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'invs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Connection and Fetch Tables Route
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    res.json({
      status: 'success',
      message: 'Connected to INVS Database successfully!',
      tables: rows
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database.',
      error: error.message
    });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
};

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash password to MD5 to match INVS legacy format
    const md5Password = crypto.createHash('md5').update(password).digest('hex');

    const [users] = await pool.query(
      'SELECT UserCode, firstName, lastName, utype FROM profile WHERE UserCode = ? AND Password = ? AND Enable = "Y"',
      [username, md5Password]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = users[0];
    const token = jwt.sign(
      { id: user.UserCode, name: `${user.firstName} ${user.lastName}`, role: user.utype },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      token,
      user: {
        id: user.UserCode,
        name: `${user.firstName} ${user.lastName}`,
        role: user.utype
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// Inventory Data Route (Real DB)
app.get('/api/inventory', authenticateToken, async (req, res) => {
    try {
        // Querying drug_vn for drug details and med_inv for current stock levels
        // Note: Field names are based on standard legacy INVS schema patterns
        const [rows] = await pool.query(`
            SELECT 
                dv.drug_id as id, 
                dv.drug_name as name, 
                dv.drug_type as category, 
                mi.stock_qty as quantity, 
                dv.drug_unit as unit
            FROM drug_vn dv
            LEFT JOIN med_inv mi ON dv.drug_id = mi.drug_id
            LIMIT 100
        `);
        
        const inventory = rows.map(item => ({
            ...item,
            status: item.quantity > 100 ? 'ปกติ' : 'ใกล้หมด'
        }));

        res.json(inventory);
    } catch (error) {
        console.error('Inventory fetch failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Purchase Orders Data Route (Real DB)
app.get('/api/purchases', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                po_number as id, 
                po_date as date, 
                supplier_name as supplier, 
                item_count as items, 
                total_amount as total, 
                po_status as status
            FROM ms_po
            ORDER BY po_date DESC
            LIMIT 50
        `);
        res.json(rows);
    } catch (error) {
        console.error('Purchases fetch failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Dispensing Data Route (Real DB)
app.get('/api/dispense', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                dispense_id as id, 
                dispense_date as date, 
                dept_name as department, 
                patient_name as patient, 
                item_count as items, 
                status
            FROM dispensed
            ORDER BY dispense_date DESC
            LIMIT 50
        `);
        res.json(rows);
    } catch (error) {
        console.error('Dispensing fetch failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Requisition Data Route (Real DB)
app.get('/api/requisition', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                req_id as id, 
                req_date as date, 
                dept_name as department, 
                priority, 
                item_count as items, 
                req_status as status
            FROM req_con
            ORDER BY req_date DESC
            LIMIT 50
        `);
        res.json(rows);
    } catch (error) {
        console.error('Requisition fetch failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
