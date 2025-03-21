const express = require('express');
const { createPayment, getPayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Payment routes
router.use(protect);
router.post('/', createPayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Retrieve payment information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment information retrieved
 */
router.get('/', getPayment);

module.exports = router;
