// src/middleware/auth.middleware.js
const supabase = require('../config/supabase');
const { AppError } = require('./errorHandler');

/**
 * Middleware to protect routes
 */
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access', 401));
    }

    // Verify token
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return next(new AppError('Invalid token or user not found', 401));
    }

    // Set user on request
    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect
};