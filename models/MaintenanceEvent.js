const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed'],
    default: 'scheduled',
  },
  cost: {
    type: Number,
  },
  company: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceEvent', maintenanceSchema);
