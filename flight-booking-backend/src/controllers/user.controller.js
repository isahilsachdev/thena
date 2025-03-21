const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');

/**
 * Retrieves the user profile along with booked flights.
 * Validates the authorization token and handles errors during retrieval.
 * 
 * @param {Object} req - The request object containing the authorization token in headers.
 * @param {Object} res - The response object to send the result.
 * @param {Function} next - The next middleware function.
 */
const getProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the Bearer token

    if (!token) {
      return next(new AppError('Authorization token is missing', 401));
    }

    // Get user details from Supabase auth
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return next(new AppError(userError?.message || 'Failed to fetch user details', 400));
    }

    const userId = userData.user.id;

    // Get booked flights from the bookings table
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('flight_id')
      .eq('user_id', userId);

    if (bookingsError) {
      return next(new AppError(bookingsError.message, 400));
    }

    // Fetch flight details for booked flights
    const flightIds = bookingsData.map((booking) => booking.flight_id);
    const { data: flightsData, error: flightsError } = await supabase
      .from('flights')
      .select('*')
      .in('id', flightIds);

    if (flightsError) {
      return next(new AppError(flightsError.message, 400));
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile: {
          id: userData.user.id,
          email: userData.user.email,
          name: userData.user.user_metadata.name || userData.user.user_metadata.full_name,
          created_at: userData.user.created_at,
          flights: flightsData, // Include booked flights
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the user profile with the provided details.
 * Validates the user ID and handles errors during the update process.
 * 
 * @param {Object} req - The request object containing updated profile details in the body.
 * @param {Object} res - The response object to send the result.
 * @param {Function} next - The next middleware function.
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, avatar_url, bio } = req.body;
    
    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name,
        avatar_url,
        bio,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select();
    
    if (error) {
      return next(new AppError(error.message, 400));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        profile: data[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
