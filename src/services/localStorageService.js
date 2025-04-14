const KEYS = {
    DONORS: 'donors',
    REQUESTS: 'transplantRequests',
    USERS: 'users',
    CURRENT_USER: 'currentUser'
  };
  
  // Initialize default data if not exists
  const initializeStorage = () => {
    // Create admin user if not exists
    if (!localStorage.getItem(KEYS.USERS)) {
      const defaultUsers = [
        {
          id: 1,
          username: 'admin',
          password: 'admin123', // In a real app, use proper password hashing
          role: 'admin',
          name: 'Admin User'
        }
      ];
      localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
    }
    
    // Initialize donors array if not exists
    if (!localStorage.getItem(KEYS.DONORS)) {
      localStorage.setItem(KEYS.DONORS, JSON.stringify([]));
    }
    
    // Initialize requests array if not exists
    if (!localStorage.getItem(KEYS.REQUESTS)) {
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify([]));
    }
  };
  
  // Call initialize on import
  initializeStorage();
  
  // Donor related functions
  export const getAllDonors = () => {
    return JSON.parse(localStorage.getItem(KEYS.DONORS)) || [];
  };
  
  export const addDonor = (donor) => {
    const donors = getAllDonors();
    const newDonor = {
      ...donor,
      id: donors.length > 0 ? Math.max(...donors.map(d => d.id)) + 1 : 1,
      registrationDate: new Date().toISOString(),
      status: 'pending'
    };
    
    donors.push(newDonor);
    localStorage.setItem(KEYS.DONORS, JSON.stringify(donors));
    return newDonor;
  };
  
  export const updateDonorStatus = (id, status) => {
    const donors = getAllDonors();
    const updatedDonors = donors.map(donor => 
      donor.id === id ? { ...donor, status } : donor
    );
    
    localStorage.setItem(KEYS.DONORS, JSON.stringify(updatedDonors));
    return updatedDonors.find(donor => donor.id === id);
  };
  
  // Transplant request related functions
  export const getAllRequests = () => {
    return JSON.parse(localStorage.getItem(KEYS.REQUESTS)) || [];
  };
  
  export const addRequest = (request) => {
    const requests = getAllRequests();
    const newRequest = {
      ...request,
      id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    
    requests.push(newRequest);
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
    return newRequest;
  };
  
  export const updateRequestStatus = (id, status) => {
    const requests = getAllRequests();
    const updatedRequests = requests.map(request => 
      request.id === id ? { ...request, status } : request
    );
    
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(updatedRequests));
    return updatedRequests.find(request => request.id === id);
  };
  
  // User related functions
  export const authenticateUser = (username, password) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Store the current user in localStorage (without password in a real app)
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    }
    
    return user;
  };
  
  export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));
  };
  
  export const logout = () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  };
  