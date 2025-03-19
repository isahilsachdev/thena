// src/controllers/auth.controller.js
const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      return next(new AppError(error.message, 400));
    }

    res.status(201).json({
      status: 'success',
      data: {
        user: data.user,
        session: data.user.id, // Include session token in response
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login a user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Login user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log(email, password, 'first', data, error);
    if (error) {
      if (error.code === 'email_not_confirmed') {
        return next(new AppError('Email not confirmed. Please check your email for the confirmation link.', 401));
      }
      return next(new AppError(error.message, 401));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: data.user,
        session: data.user.id // Include session token in responsession: data.session
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout a user
 */
const logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return next(new AppError(error.message, 500));
    }

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  resetPassword
};
