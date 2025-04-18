const express = require('express');
const router = express.Router();

const {
  register,
  login,
  verifyAccount,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  getUserById
} = require('../controllers/authController');

// Rutas
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyAccount);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/update-profile/:id', updateProfile);
router.get('/user/:id', getUserById);


module.exports = router;
