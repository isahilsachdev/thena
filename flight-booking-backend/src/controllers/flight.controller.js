// src/controllers/flight.controller.js
const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all flights with optional filtering
 */
const getFlights = async (req, res, next) => {
  try {
    // Extract query parameters for filtering
    const { origin, destination, date, status } = req.query;
    const flights = [];
    const airlines = [
        { code: "AI", name: "Air India" },
        { code: "6E", name: "IndiGo" },
        { code: "UK", name: "Vistara" },
    ];

    airlines.forEach((airline) => {
        const numFlights = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < numFlights; i++) {
            const departureHour = 6 + Math.floor(Math.random() * 16);
            const departureMinute = Math.floor(Math.random() * 60);
            const durationHours = 1 + Math.floor(Math.random() * 3);
            const durationMinutes = Math.floor(Math.random() * 60);

            let arrivalHour = departureHour + durationHours;
            let arrivalMinute = departureMinute + durationMinutes;

            if (arrivalMinute >= 60) {
                arrivalHour += 1;
                arrivalMinute -= 60;
            }

            if (arrivalHour >= 24) {
                arrivalHour -= 24;
            }

            const formatTime = (hour, minute) => {
                const ampm = hour >= 12 ? "PM" : "AM";
                const h = hour % 12 || 12;
                const m = minute.toString().padStart(2, "0");
                return `${h}:${m} ${ampm}`;
            };

            const flightNumber = `${airline.code}${100 + Math.floor(Math.random() * 900)}`;
            const price = 2500 + Math.floor(Math.random() * 12500);
            const availableSeats = 5 + Math.floor(Math.random() * 46);

            flights.push({
                id: `${flightNumber}-${date}-${departureHour}${departureMinute}`,
                flightNumber,
                airline: airline.name,
                departureTime: formatTime(departureHour, departureMinute),
                arrivalTime: formatTime(arrivalHour, arrivalMinute),
                duration: `${durationHours}h ${durationMinutes}m`,
                price,
                availableSeats,
                origin,
                destination,
                date,
            });
        }
    });
    
    res.status(200).json({
      status: 'success',
      results: flights.length,
      data: {
        flights: flights
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single flight by ID
 */
const getFlightById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return next(new AppError(error.message, 400));
    }
    
    if (!data) {
      return next(new AppError('Flight not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        flight: data
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new flight
 */
const createFlight = async (req, res, next) => {
  try {
    const { 
      flight_number, 
      origin, 
      destination, 
      departure_date, 
      arrival_date,
      status,
      airline,
      gate
    } = req.body;
    
    // Validate required fields
    if (!flight_number || !origin || !destination || !departure_date || !arrival_date) {
      return next(new AppError('Missing required flight information', 400));
    }
    
    // Create flight in Supabase
    const { data, error } = await supabase
      .from('flights')
      .insert([
        { 
          flight_number, 
          origin, 
          destination, 
          departure_date, 
          arrival_date,
          status: status || 'scheduled',
          airline,
          gate,
          created_by: req.user.id
        }
      ])
      .select();
    
    if (error) {
      return next(new AppError(error.message, 400));
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        flight: data[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a flight
 */
const updateFlight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      flight_number,
      origin,
      destination,
      departure_date,
      arrival_date,
      status,
      airline,
      gate
    } = req.body;
    
    // Check if flight exists
    const { data: existingFlight, error: fetchError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !existingFlight) {
      return next(new AppError('Flight not found', 404));
    }
    
    // Update flight
    const { data, error } = await supabase
      .from('flights')
      .update({ 
        flight_number: flight_number || existingFlight.flight_number,
        origin: origin || existingFlight.origin,
        destination: destination || existingFlight.destination,
        departure_date: departure_date || existingFlight.departure_date,
        arrival_date: arrival_date || existingFlight.arrival_date,
        status: status || existingFlight.status,
        airline: airline || existingFlight.airline,
        gate: gate || existingFlight.gate,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return next(new AppError(error.message, 400));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        flight: data[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a flight
 */
const deleteFlight = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete flight
    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', id);
    
    if (error) {
      return next(new AppError(error.message, 400));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Server-Sent Events (SSE) endpoint for real-time flight updates
 */
const subscribeToFlightUpdates = async (req, res, next) => {
  try {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ message: 'Connected to flight updates stream' })}\n\n`);

    // Setup Supabase realtime subscription
    const subscription = supabase
      .channel('flight-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'flights' 
        }, 
        (payload) => {
          // Send the update to the client
          res.write(`data: ${JSON.stringify(payload)}\n\n`);
        }
      )
      .subscribe();

    // Handle client disconnect
    req.on('close', () => {
      logger.info('Client disconnected from SSE');
      supabase.removeChannel(subscription);
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
  subscribeToFlightUpdates
};
