class LocalStorage {
  constructor() {
    this.users = [];
    this.donors = [];
    this.requests = [];
    this.counter = 1;
  }

  // Generate unique IDs
  generateId() {
    return this.counter++;
  }

  // User methods
  getAllUsers() {
    return this.users;
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  createUser(userData) {
    const user = {
      _id: this.generateId().toString(),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(user => user._id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return null;
  }

  deleteUser(id) {
    const index = this.users.findIndex(user => user._id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Donor methods
  findDonorByUserId(userId) {
    return this.donors.find(donor => donor.userId === userId);
  }

  findDonorById(id) {
    return this.donors.find(donor => donor._id === id);
  }

  createDonor(donorData) {
    const donor = {
      _id: this.generateId().toString(),
      ...donorData,
      createdAt: new Date()
    };
    this.donors.push(donor);
    return donor;
  }

  getAllDonors() {
    return this.donors.map(donor => {
      const user = this.findUserById(donor.userId);
      return {
        ...donor,
        user: user ? {
          name: user.name,
          email: user.email,
          bloodGroup: user.bloodGroup,
          phone: user.phone
        } : null
      };
    });
  }

  updateDonorStatus(id, isAvailable) {
    const donor = this.donors.find(d => d._id === id);
    if (donor) {
      donor.isAvailable = isAvailable;
      return donor;
    }
    return null;
  }

  // Request methods
  findRequestById(id) {
    return this.requests.find(r => r._id === id);
  }

  createRequest(requestData) {
    const request = {
      _id: this.generateId().toString(),
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.requests.push(request);
    return request;
  }

  getAllRequests() {
    return this.requests.map(request => {
      const requester = this.findUserById(request.requesterId);
      const donor = request.matchedDonor ? this.findDonorById(request.matchedDonor) : null;
      return {
        ...request,
        requester: requester ? {
          name: requester.name,
          email: requester.email,
          bloodGroup: requester.bloodGroup,
          phone: requester.phone
        } : null,
        matchedDonor: donor ? {
          organs: donor.organs,
          medicalHistory: donor.medicalHistory
        } : null
      };
    });
  }

  getUserRequests(userId) {
    return this.requests
      .filter(request => request.requesterId === userId)
      .map(request => {
        const donor = request.matchedDonor ? this.findDonorById(request.matchedDonor) : null;
        return {
          ...request,
          matchedDonor: donor ? {
            organs: donor.organs,
            medicalHistory: donor.medicalHistory
          } : null
        };
      });
  }

  updateRequestStatus(id, status) {
    const request = this.requests.find(r => r._id === id);
    if (request) {
      request.status = status;
      request.updatedAt = new Date();
      return request;
    }
    return null;
  }

  matchDonorToRequest(requestId, donorId) {
    const request = this.requests.find(r => r._id === requestId);
    if (request) {
      request.matchedDonor = donorId;
      request.status = 'matched';
      request.updatedAt = new Date();
      return request;
    }
    return null;
  }
}

// Create a singleton instance
const storage = new LocalStorage();

module.exports = storage; 