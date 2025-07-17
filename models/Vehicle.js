const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['truck', 'car', 'van', 'motorcycle', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  },
  location: {
    lat: Number,
    lng: Number,
  },
  clientName: {
    type: String, // For internal grouping
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);

// company: {
//   type: String, // link to user.company
//   required: true,
// },