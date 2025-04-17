const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organType: {
    type: String,
    enum: ['heart', 'lungs', 'liver', 'kidneys', 'pancreas', 'intestines', 'corneas', 'skin', 'bones'],
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  hospital: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },
  medicalDetails: {
    diagnosis: String,
    additionalNotes: String
  },
  matchedDonor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request; 