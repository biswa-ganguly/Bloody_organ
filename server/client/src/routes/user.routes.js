const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const storage = require('../services/storage.service');

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = storage.getAllUsers();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = storage.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'address', 'bloodGroup'];
    
    // Filter out invalid updates
    Object.keys(updates).forEach(update => {
      if (!allowedUpdates.includes(update)) {
        delete updates[update];
      }
    });

    const updatedUser = storage.updateUser(req.user._id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Change password
router.patch('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = storage.findUserById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    storage.updateUser(req.user._id, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// Delete user account
router.delete('/profile', auth, async (req, res) => {
  try {
    const success = storage.deleteUser(req.user._id);
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
});

// Get user statistics (admin only)
router.get('/statistics', adminAuth, async (req, res) => {
  try {
    const users = storage.getAllUsers();
    const totalUsers = users.length;
    const totalDonors = users.filter(user => user.isDonor).length;
    
    // Calculate blood group statistics
    const bloodGroupStats = users.reduce((stats, user) => {
      const group = user.bloodGroup;
      stats[group] = (stats[group] || 0) + 1;
      return stats;
    }, {});

    res.json({
      totalUsers,
      totalDonors,
      bloodGroupStats: Object.entries(bloodGroupStats).map(([group, count]) => ({
        _id: group,
        count
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router; 