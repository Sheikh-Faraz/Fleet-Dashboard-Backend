const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/company-fleet', protect, (req, res) => {
  res.json({
    message: 'This is your company fleet data!',
    user: req.user,
  });
});

// Example: Only Admins allowed
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  res.json({
    message: 'Only admin can see this',
    user: req.user,
  });
});

module.exports = router;
