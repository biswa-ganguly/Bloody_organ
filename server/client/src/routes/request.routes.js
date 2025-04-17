const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth.middleware');
const storage = require('../services/storage.service');

// Create new transplant request
router.post('/', auth, async (req, res) => {
  try {
    const {
      organType,
      bloodGroup,
      urgency,
      hospital,
      medicalDetails
    } = req.body;

    const request = storage.createRequest({
      requesterId: req.user._id,
      organType,
      bloodGroup,
      urgency,
      hospital,
      medicalDetails
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
});

// Get all requests (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const requests = storage.getAllRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Get user's requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = storage.getUserRequests(req.user._id);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Get request by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const request = storage.findRequestById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only allow requester or admin to view request
    if (request.requesterId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request', error: error.message });
  }
});

// Update request status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRequest = storage.updateRequestStatus(req.params.id, status);

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status', error: error.message });
  }
});

// Match donor to request (admin only)
router.post('/:id/match', adminAuth, async (req, res) => {
  try {
    const { donorId } = req.body;
    const request = storage.findRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const donor = storage.findDonorById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Check if donor is available and has matching organ
    if (!donor.isAvailable || !donor.organs.includes(request.organType)) {
      return res.status(400).json({ message: 'Donor is not available or does not have matching organ' });
    }

    const updatedRequest = storage.matchDonorToRequest(req.params.id, donorId);
    storage.updateDonorStatus(donorId, false);

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error matching donor', error: error.message });
  }
});

// Search requests by organ type and blood group
router.get('/search', auth, async (req, res) => {
  try {
    const { organType, bloodGroup, status } = req.query;
    const query = {};

    if (organType) {
      query.organType = organType;
    }

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate('requesterId', 'name email bloodGroup phone')
      .populate('matchedDonor', 'organs medicalHistory')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error searching requests', error: error.message });
  }
});

module.exports = router; 