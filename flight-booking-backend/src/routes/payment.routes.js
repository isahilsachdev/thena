const express = require('express');
const { createPayment, getPayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Payment routes
router.use(protect);
router.post('/', createPayment);
router.get('/', getPayment);

module.exports = router;
