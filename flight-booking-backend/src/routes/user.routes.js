// src/routes/user.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { 
  getProfile, 
  updateProfile,
} = require('../controllers/user.controller');
const { cancelBooking } = require('../controllers/booking.controller');

const router = express.Router();

// All user routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

router.delete('/bookings/:bookingId', cancelBooking);

module.exports = router;
