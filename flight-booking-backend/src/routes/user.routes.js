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

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.patch('/profile', updateProfile);

/**
 * @swagger
 * /users/bookings/{bookingId}:
 *   delete:
 *     summary: Cancel a booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: The ID of the booking to cancel
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Booking canceled successfully
 */
router.delete('/bookings/:bookingId', cancelBooking);

module.exports = router;
