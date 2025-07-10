const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getCompanyVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Anyone logged in from a company can view
router.get('/', protect, getCompanyVehicles);
router.get('/:id', protect, getVehicle);

// Only admins/managers can create, update, delete
router.post('/', protect, authorizeRoles('admin', 'manager'), createVehicle);
router.put('/:id', protect, authorizeRoles('admin', 'manager'), updateVehicle);
router.delete('/:id', protect, authorizeRoles('admin', 'manager'), deleteVehicle);

module.exports = router;
