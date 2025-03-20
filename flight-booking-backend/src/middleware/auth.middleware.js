const supabase = require('../config/supabase');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access', 401));
    }

    let { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      // Attempt to refresh session if token is expired
      const refreshToken = req.cookies?.refresh_token; // Ensure refresh token is stored in cookies
      if (refreshToken) {
        const { data: newSession, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (refreshError || !newSession) {
          return next(new AppError('Session expired. Please log in again', 401));
        }
        req.user = newSession.user;
      } else {
        return next(new AppError('Invalid token or session expired', 401));
      }
    } else {
      req.user = data.user;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
