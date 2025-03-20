const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

const createPayment = async (req, res, next) => {
  const { amount, cardNumber, flightId } = req.body;

  // Validate required fields
  if (!amount || !flightId || !cardNumber) {
    return res.status(400).json({ message: 'Missing required payment information' });
  }

  try {
    const userId = req.user.id; // Get the user ID from the authenticated request

    // Validate user ID
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Filter out null flight IDs
    const validFlightIds = flightId.filter((id) => !!id);

    if (validFlightIds.length === 0) {
      return res.status(400).json({ message: 'No valid flight IDs provided' });
    }

    const uuid = uuidv4();
    // Insert missing flights into the flights table
    const flightInsertPromises = validFlightIds.map((id) =>
      supabase
        .from('flights')
        .upsert([{ id: uuid, flight_number: id, origin: 'AMD', destination: 'AGX', departure_date: new Date().toISOString(), arrival_date: new Date().toISOString(), airline: 'IndiGo'}], { onConflict: 'id' }) // Insert mock flight data as i use mock flight data to show flights
    );

    const flightInsertResults = await Promise.all(flightInsertPromises);

    // Check for errors in flight inserts
    const flightInsertErrors = flightInsertResults.filter(({ error }) => error);
    if (flightInsertErrors.length > 0) {
      console.error('Supabase Flight Insert Errors:', flightInsertErrors);
      return res.status(500).json({ message: 'Error inserting flights', errors: flightInsertErrors });
    }

    // Use the first valid flight ID for the payment
    const primaryFlightId = validFlightIds[0];

    // Create payment in Supabase
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([{ amount, cardnumber: cardNumber, userid: userId, flightid: primaryFlightId }]);

    if (paymentError) {
      console.error('Supabase Payment Error:', paymentError);
      return res.status(500).json({ message: 'Error creating payment', error: paymentError });
    }

    // Create bookings for each valid flight ID
    const bookingPromises = validFlightIds.map((id) => {
      return supabase
        .from('bookings')
        .insert([{ user_id: userId, flight_id: uuid, original_flight_id: id, booking_reference: id, passenger_name: req.user.user_metadata.name, price: amount }]);
    });

    const bookingResults = await Promise.all(bookingPromises);

    // Check for errors in any of the booking inserts
    const bookingErrors = bookingResults.filter(({ error }) => error);
    if (bookingErrors.length > 0) {
      console.error('Supabase Booking Errors:', bookingErrors);
      return res.status(500).json({ message: 'Error creating some bookings', errors: bookingErrors });
    }

    console.log('Bookings Created:', bookingResults);

    res.status(201).json({
      message: 'Payment and bookings created successfully',
      payment: { amount, cardNumber, flightId: primaryFlightId },
      bookings: bookingResults.map(({ data }) => data), // Return all created bookings
    });
  } catch (err) {
    console.error('Unexpected Error:', err);
    res.status(500).json({ message: 'Unexpected error occurred', error: err });
  }
};

/**
 * Get all payments
 */
const getPayment = async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*');

  if (error) {
    return res.status(500).json({ message: 'Error retrieving payments', error });
  }

  res.status(200).json({ payments: data });
};

module.exports = {
  createPayment,
  getPayment,
};
