const express = require('express');
const { cancelBooking } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Booking routes
router.use(protect);
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Booking created successfully' });
});

/**
 * @swagger
 * /bookings/{bookingId}:
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
router.delete('/:bookingId', cancelBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Retrieve all bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved all bookings
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Retrieved all bookings' });
});

module.exports = router;
