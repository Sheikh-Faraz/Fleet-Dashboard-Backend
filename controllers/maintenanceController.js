const Maintenance = require('../models/MaintenanceEvent');
const Vehicle = require('../models/Vehicle');

// Add maintenance
exports.addMaintenance = async (req, res) => {
  const { vehicle, description, status, cost } = req.body;

  try {
    const targetVehicle = await Vehicle.findOne({ _id: vehicle, company: req.user.company });
    if (!targetVehicle) return res.status(404).json({ message: 'Vehicle not found or not yours' });

    const record = await Maintenance.create({
      vehicle,
      description,
      status,
      cost,
      company: req.user.company,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all maintenance for company
exports.getAllMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find({ company: req.user.company }).populate('vehicle', 'name licensePlate');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get maintenance by vehicle
exports.getMaintenanceByVehicle = async (req, res) => {
  try {
    const records = await Maintenance.find({
      company: req.user.company,
      vehicle: req.params.vehicleId,
    }).populate('vehicle', 'name licensePlate');

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
