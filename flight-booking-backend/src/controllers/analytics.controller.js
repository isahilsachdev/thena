const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get analytics data
 */
const getAnalytics = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Count total users signed up (Using Supabase Admin API)
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) return next(new AppError(usersError.message, 500));
    const totalUsers = usersData?.users?.length || 0;

    // Count active users today
    const activeUsersToday = usersData?.users?.filter(user => user.last_sign_in_at?.startsWith(today)).length || 0;

    // Calculate money spent by each user on flight bookings
    const { data: userSpending, error: spendingError } = await supabase
      .rpc('get_user_spending');

    if (spendingError) return next(new AppError(spendingError.message, 500));

    // Count total flights booked
    const { count: totalFlightsBooked } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' });

    const { data: totalEarningsData, error: earningsError } = await supabase
      .from('bookings')
      .select('price')
    
    if (earningsError) return next(new AppError(earningsError.message, 500));
    
    const earnings = totalEarningsData
      ?.filter(row => row.price !== null) // Remove null values
      .reduce((sum, row) => sum + row.price, 0) || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days including today
    const last7Days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(sevenDaysAgo.getDate() + i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    // Users signed up in the last 7 days
    const usersLast7Days = last7Days.map(date =>
      usersData?.users?.filter(user => user.created_at?.startsWith(date)).length || 0
    );

    // Flights booked in the last 7 days
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('created_at');

    if (bookingsError) return next(new AppError(bookingsError.message, 500));

    const flightsLast7Days = last7Days.map(date =>
      bookingsData?.filter(booking => booking.created_at?.startsWith(date)).length || 0
    );

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        activeUsersToday,
        userSpending,
        totalFlightsBooked,
        totalEarnings: earnings,
        usersLast7Days,
        flightsLast7Days,
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAnalytics,
};
