const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

const { updateProfile } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const { updateCompanySettings } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.put('/profile', protect, updateProfile);

router.put('/company-settings', protect, authorizeRoles('admin'), updateCompanySettings);

module.exports = router;
