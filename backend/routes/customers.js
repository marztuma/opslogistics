const express = require('express');
const db = require('../config/database');
const { authMiddleware, customerMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get customer profile
router.get('/profile', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT c.id, c.business_name, c.phone, c.industry, c.volume_tier,
              c.total_shipments, c.total_spending, u.email, u.first_name, u.last_name
       FROM customers c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer profile' });
  }
});

// Update customer profile
router.put('/profile', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { business_name, phone, industry } = req.body;

    const result = await db.query(
      `UPDATE customers SET business_name = $1, phone = $2, industry = $3
       WHERE user_id = $4
       RETURNING id, business_name, phone, industry`,
      [business_name, phone, industry, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      customer: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get customer addresses
router.get('/addresses', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const customerResult = await db.query(
      'SELECT id FROM customers WHERE user_id = $1',
      [userId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const addressResult = await db.query(
      `SELECT id, street, city, state, postal_code, country, address_type, is_default
       FROM addresses
       WHERE customer_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [customerResult.rows[0].id]
    );

    res.json(addressResult.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Add address
router.post('/addresses', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { street, city, state, postal_code, country, address_type, is_default } = req.body;

    const customerResult = await db.query(
      'SELECT id FROM customers WHERE user_id = $1',
      [userId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerId = customerResult.rows[0].id;

    const result = await db.query(
      `INSERT INTO addresses
        (customer_id, street, city, state, postal_code, country, address_type, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, street, city, country`,
      [customerId, street, city, state, postal_code, country, address_type, is_default || false]
    );

    res.status(201).json({
      message: 'Address added successfully',
      address: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add address' });
  }
});

// Delete address
router.delete('/addresses/:id', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM addresses WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Get customer statistics
router.get('/stats', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const statsResult = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM shipments WHERE customer_id = c.id) as total_shipments,
        (SELECT COUNT(*) FROM shipments WHERE customer_id = c.id AND status = 'delivered') as delivered_shipments,
        c.total_spending,
        (SELECT COUNT(*) FROM orders WHERE customer_id = c.id AND payment_status = 'paid') as paid_orders
       FROM customers c
       WHERE c.user_id = $1`,
      [userId]
    );

    res.json(statsResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
