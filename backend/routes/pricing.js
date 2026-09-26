const express = require('express');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all pricing rules
router.get('/rules', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, origin_country, destination_country, service_type, weight_min, weight_max,
              price_per_kg, price_per_shipment, surcharge, effective_from, effective_to
       FROM pricing_rules
       WHERE effective_to IS NULL OR effective_to > NOW()
       ORDER BY origin_country, destination_country`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing rules' });
  }
});

// Create pricing rule (admin only)
router.post('/rules', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      origin_country,
      destination_country,
      service_type,
      weight_min,
      weight_max,
      price_per_kg,
      price_per_shipment,
      surcharge
    } = req.body;

    const result = await db.query(
      `INSERT INTO pricing_rules
        (origin_country, destination_country, service_type, weight_min, weight_max,
         price_per_kg, price_per_shipment, surcharge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, origin_country, destination_country, service_type, price_per_kg`,
      [origin_country, destination_country, service_type, weight_min, weight_max,
       price_per_kg, price_per_shipment, surcharge]
    );

    res.status(201).json({
      message: 'Pricing rule created',
      rule: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create pricing rule' });
  }
});

// Update pricing rule (admin only)
router.put('/rules/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { price_per_kg, price_per_shipment, surcharge } = req.body;

    const result = await db.query(
      `UPDATE pricing_rules
       SET price_per_kg = $1, price_per_shipment = $2, surcharge = $3
       WHERE id = $4
       RETURNING id, origin_country, destination_country, price_per_kg`,
      [price_per_kg, price_per_shipment, surcharge, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pricing rule not found' });
    }

    res.json({
      message: 'Pricing rule updated',
      rule: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pricing rule' });
  }
});

// Get tariff rates
router.get('/tariffs', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, country_code, hs_code, duty_percentage, tax_percentage, last_updated
       FROM tariff_rates
       ORDER BY country_code, hs_code`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tariff rates' });
  }
});

// Update tariff rate (admin only)
router.put('/tariffs/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { duty_percentage, tax_percentage, restrictions } = req.body;

    const result = await db.query(
      `UPDATE tariff_rates
       SET duty_percentage = $1, tax_percentage = $2, restrictions = $3, last_updated = NOW()
       WHERE id = $4
       RETURNING id, country_code, hs_code, duty_percentage, tax_percentage`,
      [duty_percentage, tax_percentage, restrictions, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tariff rate not found' });
    }

    res.json({
      message: 'Tariff rate updated',
      tariff: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tariff rate' });
  }
});

// Get volume discounts
router.get('/discounts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, customer_id, shipment_count_min, shipment_count_max, discount_percentage
       FROM volume_discounts
       WHERE effective_to IS NULL OR effective_to > NOW()
       ORDER BY customer_id`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch discounts' });
  }
});

// Create volume discount (admin only)
router.post('/discounts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { customer_id, shipment_count_min, shipment_count_max, discount_percentage } = req.body;

    const result = await db.query(
      `INSERT INTO volume_discounts
        (customer_id, shipment_count_min, shipment_count_max, discount_percentage, effective_from)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, customer_id, discount_percentage`,
      [customer_id, shipment_count_min, shipment_count_max, discount_percentage]
    );

    res.status(201).json({
      message: 'Volume discount created',
      discount: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create discount' });
  }
});

module.exports = router;
