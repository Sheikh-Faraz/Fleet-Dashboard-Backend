const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');

// Add fuel log
exports.addFuelLog = async (req, res) => {
  // const { vehicle, amount, cost } = req.body;

  try {
    const newFuelLog = new FuelLog(req.body);
        const saved = await newFuelLog.save();
        res.status(201).json(saved);
    // const targetVehicle = await Vehicle.findOne({ _id: vehicle, company: req.user.company });
    // if (!targetVehicle) return res.status(404).json({ message: 'Vehicle not found or access denied' });

    // const fuelLog = new FuelLog({
    //   vehicle,
    //   amount,
    //   cost,
    //   company: req.user.company,
    // });

    // const saved = await fuelLog.save();
    // res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all fuel logs for company
exports.getFuelLogs = async (req, res) => {
  try {
        let fuels;
    
        // Admin sees everything
        if (req.user.role === 'admin') {
          fuels = await FuelLog.find();
        } else {
          fuels = await FuelLog.find({
            _id: { $in: req.user.FuelLog },
          });
        }
    
        res.json(fuels);
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

// Delete fuel log single by id 
exports.deleteFuelLog = async (req, res) => {
    try{
        const log = await FuelLog.findByIdAndDelete(req.params.id)

        if (!log) return res.status(404).json({ message: "FuelLog not found" });

         res.json({ message: "FuelLog deleted successfully", log });
  } catch (err) {
    // res.status(500).json({ message: err.message });
        console.error("❌ Deleting User Error:", err); // log full error
     res.status(500).json({ message: err.message || "Something went wrong" });
  }
}



// ✅ PUT /api/fuel/:id → Update full user info
exports.updateFuelLog = async (req, res) => {
  try {
    const { vehicle, amount, cost, date } = req.body;

    const updatedFuelLog = await FuelLog.findByIdAndUpdate(
      req.params.id,
      {
        vehicle,
        amount,
        cost,
        date,
      },
      { new: true }
    );

    if (!updatedFuelLog) {
      return res.status(404).json({ message: "Fuel log not found" });
    }

    res.json({
      message: "Fuel log updated successfully",
      fuelLog: updatedFuelLog,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};