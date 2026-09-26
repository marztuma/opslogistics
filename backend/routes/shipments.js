const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authMiddleware, customerMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create shipment
router.post('/', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const {
      origin_address_id,
      destination_address_id,
      shipment_type,
      service_type,
      weight,
      dimensions,
      contents,
      items
    } = req.body;

    const customerId = req.user.id;
    const trackingNumber = 'OPS' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    const shipmentResult = await db.query(
      `INSERT INTO shipments
        (tracking_number, customer_id, origin_address_id, destination_address_id,
         shipment_type, service_type, weight, dimensions, contents)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, tracking_number, created_at`,
      [trackingNumber, customerId, origin_address_id, destination_address_id, shipment_type, service_type, weight, dimensions, contents]
    );

    const shipmentId = shipmentResult.rows[0].id;

    // Add shipment items
    if (items && items.length > 0) {
      for (const item of items) {
        await db.query(
          'INSERT INTO shipment_items (shipment_id, description, quantity, weight, value, hs_code) VALUES ($1, $2, $3, $4, $5, $6)',
          [shipmentId, item.description, item.quantity, item.weight, item.value, item.hs_code]
        );
      }
    }

    // Add initial tracking record
    await db.query(
      'INSERT INTO shipment_tracking (shipment_id, status, location, notes) VALUES ($1, $2, $3, $4)',
      [shipmentId, 'pending', 'Origin', 'Shipment created']
    );

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment: shipmentResult.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Get all shipments for customer
router.get('/', authMiddleware, customerMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const result = await db.query(
      `SELECT id, tracking_number, shipment_type, service_type, status, weight,
              created_at, pickup_date, delivery_date
       FROM shipments
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customerId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Get shipment by tracking number
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipmentResult = await db.query(
      `SELECT id, tracking_number, shipment_type, service_type, status, weight, dimensions,
              origin_address_id, destination_address_id, created_at, pickup_date, delivery_date
       FROM shipments
       WHERE tracking_number = $1`,
      [trackingNumber]
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const shipment = shipmentResult.rows[0];

    // Get tracking history
    const trackingResult = await db.query(
      `SELECT status, location, timestamp, notes
       FROM shipment_tracking
       WHERE shipment_id = $1
       ORDER BY timestamp DESC`,
      [shipment.id]
    );

    res.json({
      shipment,
      tracking_history: trackingResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// Update shipment status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, notes } = req.body;

    const shipmentResult = await db.query(
      'UPDATE shipments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status',
      [status, id]
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Add tracking record
    await db.query(
      'INSERT INTO shipment_tracking (shipment_id, status, location, notes) VALUES ($1, $2, $3, $4)',
      [id, status, location, notes]
    );

    res.json({
      message: 'Shipment status updated',
      shipment: shipmentResult.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shipment' });
  }
});

// Get shipment details with items
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const shipmentResult = await db.query(
      'SELECT * FROM shipments WHERE id = $1',
      [id]
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const itemsResult = await db.query(
      'SELECT * FROM shipment_items WHERE shipment_id = $1',
      [id]
    );

    const trackingResult = await db.query(
      'SELECT * FROM shipment_tracking WHERE shipment_id = $1 ORDER BY timestamp DESC',
      [id]
    );

    res.json({
      shipment: shipmentResult.rows[0],
      items: itemsResult.rows,
      tracking: trackingResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment details' });
  }
});

module.exports = router;
