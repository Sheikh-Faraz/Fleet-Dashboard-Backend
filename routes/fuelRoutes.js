const express = require('express');
const router = express.Router();
const {
  addFuelLog,
  getFuelLogs,
  getFuelLogsForVehicle,
} = require('../controllers/fuelController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Anyone in the company can read
router.get('/', protect, getFuelLogs);
router.get('/:vehicleId', protect, getFuelLogsForVehicle);

// Only admin/manager can add
router.post('/', protect, authorizeRoles('admin', 'manager'), addFuelLog);

module.exports = router;
