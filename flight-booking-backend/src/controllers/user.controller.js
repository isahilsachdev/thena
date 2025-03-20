const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get user profile
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
          name: userData.user.user_metadata.name,
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
 * Update user profile
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
