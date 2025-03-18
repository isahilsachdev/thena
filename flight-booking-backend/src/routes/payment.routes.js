const express = require('express');
const { createPayment, getPayment } = require('../controllers/payment.controller');

const router = express.Router();

// Payment routes
router.post('/', createPayment);
router.get('/', getPayment);

module.exports = router;
