const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');

/**
 * Cancels a booking with the specified booking ID.
 * Validates the authorization token and checks if the booking exists before deletion.
 * 
 * @param {Object} req - The request object containing the booking ID in the parameters and authorization token in headers.
 * @param {Object} res - The response object to send the result.
 * @param {Function} next - The next middleware function.
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const token = req.headers.authorization?.split(' ')[1]; // Extract the Bearer token

    if (!token) {
      return next(new AppError('Authorization token is missing', 401));
    }

    // Validate the booking ID and fetch the booking details
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('flight_id', bookingId)
      .single();

    if (bookingError || !bookingData) {
      return next(new AppError('Booking not found', 404));
    }

    // Delete the booking from the database
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('flight_id', bookingId);

    if (deleteError) {
      return next(new AppError(deleteError.message, 400));
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  cancelBooking,
};
