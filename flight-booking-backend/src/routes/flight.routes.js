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

/**
 * @swagger
 * /flights:
 *   get:
 *     summary: Retrieve all flights
 *     responses:
 *       200:
 *         description: A list of flights
 */
router.get('/', getFlights);

/**
 * @swagger
 * /flights/{id}:
 *   get:
 *     summary: Retrieve a flight by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the flight to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A flight object
 */
router.get('/:id', getFlightById);

/**
 * @swagger
 * /flights/updates/stream:
 *   get:
 *     summary: Subscribe to flight updates
 *     responses:
 *       200:
 *         description: Stream of flight updates
 */
router.get('/updates/stream', subscribeToFlightUpdates); // SSE endpoint

// Protected routes
router.use(protect);
router.post('/', createFlight);

/**
 * @swagger
 * /flights/{id}:
 *   patch:
 *     summary: Update a flight by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the flight to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight updated
 */
router.patch('/:id', updateFlight);

/**
 * @swagger
 * /flights/{id}:
 *   delete:
 *     summary: Delete a flight by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the flight to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Flight deleted
 */
router.delete('/:id', deleteFlight);

module.exports = router;
