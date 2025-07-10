const express = require('express');
const router = express.Router();
const {
  addMaintenance,
  getAllMaintenance,
  getMaintenanceByVehicle,
} = require('../controllers/maintenanceController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Read for all company users
router.get('/', protect, getAllMaintenance);
router.get('/:vehicleId', protect, getMaintenanceByVehicle);

// Add = admin/manager
router.post('/', protect, authorizeRoles('admin', 'manager'), addMaintenance);

module.exports = router;
