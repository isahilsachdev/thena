// src/routes/index.js
const express = require('express');
const authRoutes = require('./auth.routes');
const flightRoutes = require('./flight.routes');
const userRoutes = require('./user.routes');
const paymentRoutes = require('./payment.routes');
const analyticsRoutes = require('./analytics.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/flights', flightRoutes);
router.use('/users', userRoutes);
router.use('/payment', paymentRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
