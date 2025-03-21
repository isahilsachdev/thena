const express = require('express');
const { cancelBooking } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Booking routes
router.use(protect);
router.post('/', (req, res) => {
  // Logic to create a booking will go here
  res.status(201).json({ message: 'Booking created successfully' });
});
router.delete('/:bookingId', cancelBooking);
router.get('/', (req, res) => {
  // Logic to retrieve all bookings will go here
  res.status(200).json({ message: 'Retrieved all bookings' });
});

module.exports = router;
