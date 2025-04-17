const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organs: [{
    type: String,
    enum: ['heart', 'lungs', 'liver', 'kidneys', 'pancreas', 'intestines', 'corneas', 'skin', 'bones'],
    required: true
  }],
  medicalHistory: {
    type: String,
    trim: true
  },
  lastDonationDate: {
    type: Date
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
donorSchema.index({ location: '2dsphere' });

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor; 