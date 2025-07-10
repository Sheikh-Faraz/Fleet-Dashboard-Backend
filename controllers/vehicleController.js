const Vehicle = require('../models/Vehicle');

// Create vehicle
exports.createVehicle = async (req, res) => {
  try {
    const newVehicle = new Vehicle({ ...req.body, company: req.user.company });
    const saved = await newVehicle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all vehicles for the company
exports.getCompanyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ company: req.user.company });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one vehicle (must belong to same company)
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, company: req.user.company });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Vehicle not found or not allowed' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company,
    });
    if (!deleted) return res.status(404).json({ message: 'Vehicle not found or not allowed' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
