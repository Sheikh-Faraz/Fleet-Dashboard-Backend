const Vehicle = require('../models/Vehicle');

// Create vehicle
exports.createVehicle = async (req, res) => {
  try {
    // const newVehicle = new Vehicle({ ...req.body, company: req.user.company });
    const newVehicle = new Vehicle(req.body);
    const saved = await newVehicle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all vehicles visible to this user
exports.getAllVehicles = async (req, res) => {
  try {
    let vehicles;

    // Admin sees everything
    if (req.user.role === 'admin') {
      vehicles = await Vehicle.find();
    } else {
      vehicles = await Vehicle.find({
        _id: { $in: req.user.assignedVehicles },
      });
    }

    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one vehicle (must belong to same company)
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    if (
      req.user.role !== 'admin' &&
      !req.user.assignedVehicles.includes(vehicle._id.toString())
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Vehicle not found' });

    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
