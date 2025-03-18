// src/routes/user.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { 
  getProfile, 
  updateProfile 
} = require('../controllers/user.controller');

const router = express.Router();

// All user routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

module.exports = router;