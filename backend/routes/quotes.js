const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Generate quote
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      origin_country,
      destination_country,
      weight,
      dimensions,
      service_type,
      shipment_type,
      items
    } = req.body;

    if (!origin_country || !destination_country || !weight || !service_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const customerId = req.user.role === 'customer' ? req.user.id : null;
    const quoteNumber = 'QT' + Date.now();

    // Get pricing rule
    const pricingResult = await db.query(
      `SELECT price_per_kg, price_per_shipment, surcharge FROM pricing_rules
       WHERE origin_country = $1 AND destination_country = $2 AND service_type = $3
       ORDER BY effective_from DESC LIMIT 1`,
      [origin_country, destination_country, service_type]
    );

    let basePrice = 0;
    if (pricingResult.rows.length > 0) {
      const rule = pricingResult.rows[0];
      basePrice = (weight * rule.price_per_kg) + (rule.price_per_shipment || 0) + (rule.surcharge || 0);
    } else {
      basePrice = weight * 10; // Default pricing
    }

    // Calculate tariff
    let tariffCost = 0;
    if (items && items.length > 0) {
      for (const item of items) {
        const tariffResult = await db.query(
          `SELECT duty_percentage, tax_percentage FROM tariff_rates
           WHERE country_code = $1 AND hs_code = $2`,
          [destination_country, item.hs_code]
        );

        if (tariffResult.rows.length > 0) {
          const tariff = tariffResult.rows[0];
          const itemValue = item.value || 0;
          tariffCost += itemValue * (tariff.duty_percentage / 100);
        }
      }
    }

    const tax = (basePrice + tariffCost) * 0.1; // 10% tax
    const totalPrice = basePrice + tariffCost + tax;

    const quoteResult = await db.query(
      `INSERT INTO quotes
        (quote_number, customer_id, origin_country, destination_country, weight, dimensions,
         service_type, shipment_type, base_price, tariff_cost, tax, total_price, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW() + INTERVAL '7 days')
       RETURNING id, quote_number, total_price, valid_until`,
      [quoteNumber, customerId, origin_country, destination_country, weight, dimensions,
       service_type, shipment_type, basePrice, tariffCost, tax, totalPrice]
    );

    res.json({
      quote: quoteResult.rows[0],
      breakdown: {
        base_price: basePrice,
        tariff_cost: tariffCost,
        tax: tax,
        total_price: totalPrice
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// Get customer quotes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customerId = req.user.id;
    const result = await db.query(
      `SELECT id, quote_number, origin_country, destination_country, total_price,
              valid_until, created_at
       FROM quotes
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customerId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Get quote details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM quotes WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

module.exports = router;
