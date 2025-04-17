const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth.middleware');
const storage = require('../services/storage.service');

// Register as a donor
router.post('/', auth, async (req, res) => {
  try {
    const { organs, medicalHistory, location } = req.body;

    // Check if user is already a donor
    const existingDonor = storage.findDonorByUserId(req.user._id);
    if (existingDonor) {
      return res.status(400).json({ message: 'User is already registered as a donor' });
    }

    const donor = storage.createDonor({
      userId: req.user._id,
      organs,
      medicalHistory,
      location
    });

    // Update user's isDonor status
    storage.updateUser(req.user._id, { isDonor: true });

    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Error registering donor', error: error.message });
  }
});

// Get all donors (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const donors = storage.getAllDonors();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors', error: error.message });
  }
});

// Get donor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const donor = storage.findDonorById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donor', error: error.message });
  }
});

// Update donor status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const donor = storage.findDonorById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Only allow donor to update their own status or admin to update any
    if (donor.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedDonor = storage.updateDonorStatus(req.params.id, isAvailable);
    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating donor status', error: error.message });
  }
});

// Search donors by organ type and blood group
router.get('/search', auth, async (req, res) => {
  try {
    const { organType, bloodGroup, location } = req.query;
    const query = { isAvailable: true };

    if (organType) {
      query.organs = organType;
    }

    if (bloodGroup) {
      query['userId.bloodGroup'] = bloodGroup;
    }

    if (location) {
      // Add geospatial search if location is provided
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(location.lng), parseFloat(location.lat)]
          },
          $maxDistance: 100000 // 100km radius
        }
      };
    }

    const donors = await Donor.find(query)
      .populate('userId', 'name email bloodGroup phone')
      .sort({ createdAt: -1 });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Error searching donors', error: error.message });
  }
});

module.exports = router; 