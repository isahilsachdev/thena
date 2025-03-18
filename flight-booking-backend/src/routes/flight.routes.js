// src/routes/flight.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { 
  getFlights, 
  getFlightById, 
  createFlight, 
  updateFlight, 
  deleteFlight,
  subscribeToFlightUpdates
} = require('../controllers/flight.controller');

const router = express.Router();

// Public routes
router.get('/', getFlights);
router.get('/:id', getFlightById);
router.get('/updates/stream', subscribeToFlightUpdates); // SSE endpoint

// Protected routes
router.use(protect);
router.post('/', createFlight);
router.patch('/:id', updateFlight);
router.delete('/:id', deleteFlight);

module.exports = router;