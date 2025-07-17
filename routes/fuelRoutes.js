const express = require('express');
const router = express.Router();
const {
  addFuelLog,
  getFuelLogs,
  updateFuelLog,
  deleteFuelLog,
  getFuelLogsForVehicle,
} = require('../controllers/fuelController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Anyone in the company can read
router.get('/', protect, getFuelLogs);
router.get('/:vehicleId', protect, getFuelLogsForVehicle);

// Only admin/manager can add
router.post('/', protect, authorizeRoles('admin', 'manager'), addFuelLog);
router.put('/:id', protect, authorizeRoles('admin', 'manager'), updateFuelLog);
router.delete('/:id', protect, authorizeRoles('admin', 'manager'), deleteFuelLog);

module.exports = router;
