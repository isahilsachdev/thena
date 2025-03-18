// src/controllers/user.controller.js
const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user profile from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return next(new AppError(error.message, 400));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        profile: data
      }
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