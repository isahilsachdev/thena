// src/controllers/auth.controller.js
const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Registers a new user with the provided email, password, and name.
 * Validates input and handles errors during registration.
 * 
 * @param {Object} req - The request object containing user details.
 * @param {Object} res - The response object to send the result.
 * @param {Function} next - The next middleware function.
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
          full_name: name
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
        session: data.session.access_token, // Include session token in response
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logs in a user with the provided email and password.
 * Validates input and handles errors during login.
 * 
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object to send the result.
 * @param {Function} next - The next middleware function.
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
        session: data.session.access_token // Include session token in responsession: data.session
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logs out the currently authenticated user.
 * Handles errors during logout.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the result.
 * @param {Function} next - The next middleware function.
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
 * Sends a password reset email to the user with the provided email address.
 * Validates input and handles errors during the password reset process.
 * 
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object to send the result.
 * @param {Function} next - The next middleware function.
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
