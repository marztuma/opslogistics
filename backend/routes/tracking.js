const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Public tracking endpoint
router.get('/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const shipmentResult = await db.query(
      `SELECT id, tracking_number, shipment_type, service_type, status, weight, dimensions,
              created_at, pickup_date, delivery_date
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

    // Get current location (latest tracking)
    const currentLocation = trackingResult.rows[0] || {};

    res.json({
      tracking_number: shipment.tracking_number,
      status: shipment.status,
      current_location: currentLocation.location,
      last_update: currentLocation.timestamp,
      estimated_delivery: shipment.delivery_date,
      shipment_type: shipment.shipment_type,
      service_type: shipment.service_type,
      weight: shipment.weight,
      tracking_history: trackingResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tracking information' });
  }
});

// Batch tracking for multiple shipments
router.post('/batch', async (req, res) => {
  try {
    const { tracking_numbers } = req.body;

    if (!tracking_numbers || !Array.isArray(tracking_numbers)) {
      return res.status(400).json({ error: 'tracking_numbers must be an array' });
    }

    const result = await db.query(
      `SELECT id, tracking_number, status, created_at
       FROM shipments
       WHERE tracking_number = ANY($1)`,
      [tracking_numbers]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tracking information' });
  }
});

module.exports = router;
