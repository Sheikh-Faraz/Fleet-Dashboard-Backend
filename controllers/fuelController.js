const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');

// Add fuel log
exports.addFuelLog = async (req, res) => {
  const { vehicle, amount, cost } = req.body;

  try {
    const targetVehicle = await Vehicle.findOne({ _id: vehicle, company: req.user.company });
    if (!targetVehicle) return res.status(404).json({ message: 'Vehicle not found or access denied' });

    const fuelLog = new FuelLog({
      vehicle,
      amount,
      cost,
      company: req.user.company,
    });

    const saved = await fuelLog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all fuel logs for company
exports.getFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLog.find({ company: req.user.company }).populate('vehicle', 'name licensePlate');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logs for a specific vehicle
exports.getFuelLogsForVehicle = async (req, res) => {
  try {
    const logs = await FuelLog.find({
      company: req.user.company,
      vehicle: req.params.vehicleId,
    }).populate('vehicle', 'name licensePlate');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
