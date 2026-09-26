const express = require('express');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// ============ Public Support Routes ============

// Get all support categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, slug, icon, description FROM support_categories ORDER BY order_index ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get articles by category
router.get('/articles/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.query(
      `SELECT a.id, a.title, a.slug, a.content, a.views, a.helpful_count, a.unhelpful_count
       FROM support_articles a
       JOIN support_categories c ON a.category_id = c.id
       WHERE c.slug = $1 AND a.status = 'published'
       ORDER BY a.helpful_count DESC`,
      [slug]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get article by slug
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.query(
      `SELECT * FROM support_articles
       WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = result.rows[0];

    // Increment views
    await db.query(
      'UPDATE support_articles SET views = views + 1 WHERE id = $1',
      [article.id]
    );

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Get featured articles
router.get('/articles/featured', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, slug, description, views FROM support_articles
       WHERE featured = true AND status = 'published'
       ORDER BY views DESC LIMIT 5`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured articles' });
  }
});

// Search articles
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Query too short' });
    }

    const searchQuery = `%${query.toLowerCase()}%`;

    const result = await db.query(
      `SELECT id, title, slug, description FROM support_articles
       WHERE (LOWER(title) LIKE $1 OR LOWER(content) LIKE $1 OR LOWER(keywords) LIKE $1)
       AND status = 'published'
       ORDER BY helpful_count DESC
       LIMIT 10`,
      [searchQuery]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

// Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, question, answer, category FROM support_faqs ORDER BY order_index ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Get FAQs by category
router.get('/faqs/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const result = await db.query(
      'SELECT id, question, answer FROM support_faqs WHERE category = $1 ORDER BY order_index ASC',
      [category]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Create support ticket
router.post('/tickets', async (req, res) => {
  try {
    const { email, name, phone, subject, category, priority, message, customer_id } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ticketNumber = 'TKT' + Date.now();

    const result = await db.query(
      `INSERT INTO support_tickets
        (ticket_number, customer_id, email, name, phone, subject, category, priority, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, ticket_number, created_at`,
      [ticketNumber, customer_id || null, email, name, phone, subject, category, priority, message]
    );

    res.status(201).json({
      message: 'Support ticket created successfully',
      ticket: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get ticket by number (public)
router.get('/tickets/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const result = await db.query(
      'SELECT id, ticket_number, subject, status, created_at, updated_at FROM support_tickets WHERE ticket_number = $1',
      [ticketNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = result.rows[0];

    // Get messages
    const messagesResult = await db.query(
      `SELECT id, sender_type, sender_name, message, created_at
       FROM support_messages
       WHERE ticket_id = $1 AND is_internal = false
       ORDER BY created_at ASC`,
      [ticket.id]
    );

    res.json({
      ticket,
      messages: messagesResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Add message to ticket
router.post('/tickets/:ticketNumber/messages', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { sender_name, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ticketResult = await db.query(
      'SELECT id FROM support_tickets WHERE ticket_number = $1',
      [ticketNumber]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticketId = ticketResult.rows[0].id;

    await db.query(
      `INSERT INTO support_messages (ticket_id, sender_type, sender_name, message)
       VALUES ($1, $2, $3, $4)`,
      [ticketId, 'customer', sender_name, message]
    );

    // Update ticket updated_at
    await db.query(
      'UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [ticketId]
    );

    res.status(201).json({ message: 'Message added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Rate article helpfulness
router.post('/articles/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body;

    if (helpful === true) {
      await db.query(
        'UPDATE support_articles SET helpful_count = helpful_count + 1 WHERE id = $1',
        [id]
      );
    } else if (helpful === false) {
      await db.query(
        'UPDATE support_articles SET unhelpful_count = unhelpful_count + 1 WHERE id = $1',
        [id]
      );
    }

    res.json({ message: 'Thank you for your feedback' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to rate article' });
  }
});

// Submit ticket feedback
router.post('/tickets/:id/feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback, would_recommend } = req.body;

    await db.query(
      `INSERT INTO support_feedback (ticket_id, rating, feedback, would_recommend)
       VALUES ($1, $2, $3, $4)`,
      [id, rating, feedback, would_recommend]
    );

    // Update ticket status to closed if feedback provided
    await db.query(
      'UPDATE support_tickets SET status = $1 WHERE id = $2',
      ['closed', id]
    );

    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// ============ Admin Support Routes ============

// Get all support tickets (admin)
router.get('/admin/tickets', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM support_tickets';
    let params = [];
    let conditions = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (priority) {
      conditions.push(`priority = $${params.length + 1}`);
      params.push(priority);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      data: result.rows,
      pagination: { page, limit }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket details (admin)
router.get('/admin/tickets/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const ticketResult = await db.query(
      'SELECT * FROM support_tickets WHERE id = $1',
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];

    const messagesResult = await db.query(
      'SELECT * FROM support_messages WHERE ticket_id = $1 ORDER BY created_at ASC',
      [id]
    );

    res.json({
      ticket,
      messages: messagesResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Update ticket (admin)
router.put('/admin/tickets/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_to } = req.body;

    const result = await db.query(
      `UPDATE support_tickets
       SET status = COALESCE($1, status),
           priority = COALESCE($2, priority),
           assigned_to = COALESCE($3, assigned_to)
       WHERE id = $4
       RETURNING id, status, priority`,
      [status, priority, assigned_to, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket updated', ticket: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Add admin message to ticket
router.post('/admin/tickets/:id/messages', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { message, is_internal } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    await db.query(
      `INSERT INTO support_messages (ticket_id, user_id, sender_type, message, is_internal)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, userId, 'support', message, is_internal || false]
    );

    // Update ticket status if not already in progress
    await db.query(
      `UPDATE support_tickets
       SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'open'`,
      [id]
    );

    res.status(201).json({ message: 'Message added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Manage articles (admin)
router.get('/admin/articles', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.id, a.title, a.slug, a.status, a.featured, c.name as category, a.created_at
       FROM support_articles a
       JOIN support_categories c ON a.category_id = c.id
       ORDER BY a.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Create article (admin)
router.post('/admin/articles', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { category_id, title, slug, content, keywords, featured } = req.body;

    const result = await db.query(
      `INSERT INTO support_articles (category_id, title, slug, content, keywords, featured, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'published')
       RETURNING id, title, slug`,
      [category_id, title, slug, content, keywords, featured || false]
    );

    res.status(201).json({
      message: 'Article created successfully',
      article: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Support statistics (admin)
router.get('/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM support_tickets) as total_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'in_progress') as in_progress,
        (SELECT COUNT(*) FROM support_tickets WHERE priority = 'urgent') as urgent_tickets,
        (SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) FROM support_tickets WHERE status = 'closed') as avg_resolution_hours`
    );

    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
