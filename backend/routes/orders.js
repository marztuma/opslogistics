const express = require('express');
const db = require('../config/database');
const { authMiddleware, customerMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const { shipment_id, total_amount, discount_amount, payment_method } = req.body;
    const customerId = req.user.id;
    const orderNumber = 'ORD' + Date.now();

    const taxAmount = total_amount * 0.1;
    const finalAmount = total_amount + taxAmount - (discount_amount || 0);

    const result = await db.query(
      `INSERT INTO orders
        (order_number, customer_id, shipment_id, total_amount, tax_amount, discount_amount, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, order_number, total_amount, tax_amount, discount_amount, created_at`,
      [orderNumber, customerId, shipment_id, total_amount, taxAmount, discount_amount || 0, payment_method]
    );

    // Update customer spending
    await db.query(
      'UPDATE customers SET total_spending = total_spending + $1 WHERE user_id = $2',
      [finalAmount, customerId]
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get customer orders
router.get('/', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const result = await db.query(
      `SELECT id, order_number, total_amount, payment_status, order_status, created_at
       FROM orders
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customerId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(
      'SELECT * FROM invoice_items WHERE order_id = $1',
      [id]
    );

    res.json({
      order,
      items: itemsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING id, order_status',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Update payment status
router.put('/:id/payment', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const result = await db.query(
      'UPDATE orders SET payment_status = $1, paid_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, payment_status',
      [payment_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Payment status updated',
      order: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

module.exports = router;
