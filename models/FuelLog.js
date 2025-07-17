const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number, // liters or gallons
    required: true,
  },
  cost: {
    type: Number, // optional
  },
}, { timestamps: true });

module.exports = mongoose.model('FuelLog', fuelLogSchema);
