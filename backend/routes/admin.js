const express = require('express');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const statsResult = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM shipments) as total_shipments,
        (SELECT COUNT(*) FROM shipments WHERE status = 'delivered') as delivered,
        (SELECT COUNT(*) FROM shipments WHERE status = 'in_transit') as in_transit,
        (SELECT COUNT(*) FROM shipments WHERE status = 'failed') as failed,
        (SELECT COUNT(*) FROM orders WHERE payment_status = 'paid') as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'paid') as total_revenue,
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM users) as total_users`
    );

    res.json(statsResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get all shipments (admin view)
router.get('/shipments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, tracking_number, customer_id, status, weight, created_at FROM shipments';
    let params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      data: result.rows,
      pagination: { page, limit }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Get all customers (admin view)
router.get('/customers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { volume_tier, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT c.id, c.business_name, c.phone, c.volume_tier,
                        c.total_shipments, c.total_spending, u.email, c.created_at
                 FROM customers c
                 JOIN users u ON c.user_id = u.id`;
    let params = [];

    if (volume_tier) {
      query += ' WHERE c.volume_tier = $1';
      params.push(volume_tier);
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      data: result.rows,
      pagination: { page, limit }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer details (admin)
router.get('/customers/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const customerResult = await db.query(
      `SELECT c.id, c.business_name, c.phone, c.industry, c.volume_tier,
              c.total_shipments, c.total_spending, u.email, u.first_name, u.last_name
       FROM customers c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customerResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Update customer volume tier (admin)
router.put('/customers/:id/tier', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { volume_tier } = req.body;

    const result = await db.query(
      'UPDATE customers SET volume_tier = $1 WHERE id = $2 RETURNING id, volume_tier',
      [volume_tier, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      message: 'Customer tier updated',
      customer: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Get all orders (admin view)
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { payment_status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT o.id, o.order_number, o.customer_id, o.total_amount,
                        o.payment_status, o.order_status, o.created_at
                 FROM orders o`;
    let params = [];

    if (payment_status) {
      query += ' WHERE o.payment_status = $1';
      params.push(payment_status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      data: result.rows,
      pagination: { page, limit }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Revenue report
router.get('/reports/revenue', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = `SELECT DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue
                 FROM orders
                 WHERE payment_status = 'paid'`;
    let params = [];

    if (start_date) {
      query += ` AND created_at >= $${params.length + 1}`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND created_at <= $${params.length + 1}`;
      params.push(end_date);
    }

    query += ' GROUP BY DATE(created_at) ORDER BY date DESC';

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate revenue report' });
  }
});

// Shipment analytics
router.get('/reports/shipments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT service_type, COUNT(*) as count, AVG(weight) as avg_weight
       FROM shipments
       GROUP BY service_type
       ORDER BY count DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate shipment report' });
  }
});

// User management
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, status, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create admin user
router.post('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    const bcrypt = require('bcryptjs');

    const password_hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role`,
      [email, password_hash, first_name, last_name, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
