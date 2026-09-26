const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, deleteCloudinaryFile, getUploadSignature } = require('../middleware/cloudinary');

// Get upload signature for frontend direct uploads
router.get('/signature', authMiddleware, (req, res) => {
  try {
    const signature = getUploadSignature();
    res.json(signature);
  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

// Upload single document/image (authenticated)
router.post('/document', authMiddleware, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { document_type } = req.body;
    const userId = req.user.id;

    // Save file reference to database
    const result = await db.query(
      `INSERT INTO documents (user_id, document_type, file_url, file_name, file_size, cloudinary_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, file_url, file_name`,
      [userId, document_type || 'general', req.file.secure_url, req.file.original_name, req.file.size, req.file.public_id]
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: result.rows[0],
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Upload shipment images (batch)
router.post('/shipment-images/:shipmentId', authMiddleware, uploadMultiple, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const shipmentId = req.params.shipmentId;
    const userId = req.user.id;

    // Verify shipment ownership
    const shipmentCheck = await db.query(
      'SELECT id FROM shipments WHERE id = $1 AND user_id = $2',
      [shipmentId, userId]
    );

    if (shipmentCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access to shipment' });
    }

    // Save all image references
    const images = [];
    for (const file of req.files) {
      const result = await db.query(
        `INSERT INTO shipment_images (shipment_id, image_url, cloudinary_id)
         VALUES ($1, $2, $3)
         RETURNING id, image_url`,
        [shipmentId, file.secure_url, file.public_id]
      );
      images.push(result.rows[0]);
    }

    res.status(201).json({
      message: `${images.length} images uploaded successfully`,
      images: images,
    });
  } catch (error) {
    console.error('Shipment image upload error:', error);
    res.status(500).json({ error: 'Failed to upload shipment images' });
  }
});

// Get user documents
router.get('/documents', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT id, document_type, file_url, file_name, file_size, created_at FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({ documents: result.rows });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Delete document
router.delete('/documents/:documentId', authMiddleware, async (req, res) => {
  try {
    const documentId = req.params.documentId;
    const userId = req.user.id;

    // Get document cloudinary_id
    const docResult = await db.query(
      'SELECT cloudinary_id FROM documents WHERE id = $1 AND user_id = $2',
      [documentId, userId]
    );

    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const cloudinaryId = docResult.rows[0].cloudinary_id;

    // Delete from Cloudinary
    if (cloudinaryId) {
      await deleteCloudinaryFile(cloudinaryId);
    }

    // Delete from database
    await db.query('DELETE FROM documents WHERE id = $1', [documentId]);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Get shipment images
router.get('/shipment-images/:shipmentId', authMiddleware, async (req, res) => {
  try {
    const shipmentId = req.params.shipmentId;
    const userId = req.user.id;

    // Verify shipment ownership
    const shipmentCheck = await db.query(
      'SELECT id FROM shipments WHERE id = $1 AND user_id = $2',
      [shipmentId, userId]
    );

    if (shipmentCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access to shipment' });
    }

    const result = await db.query(
      'SELECT id, image_url, created_at FROM shipment_images WHERE shipment_id = $1 ORDER BY created_at DESC',
      [shipmentId]
    );

    res.json({ images: result.rows });
  } catch (error) {
    console.error('Error fetching shipment images:', error);
    res.status(500).json({ error: 'Failed to fetch shipment images' });
  }
});

module.exports = router;
