const KEYS = {
    DONORS: 'donors',
    REQUESTS: 'transplantRequests',
    USERS: 'users',
    CURRENT_USER: 'current_user',
    AUTH_TOKEN: 'auth_token'
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
  export const authenticateUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      // Store the token and user data
      setToken(data.token);
      setCurrentUser(data.user);
      
      return data.user;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };
  
  export const registerUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      // Store the token and user data
      setToken(data.token);
      setCurrentUser(data.user);
      
      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Auth related functions
  export const setToken = (token) => {
    localStorage.setItem(KEYS.AUTH_TOKEN, token);
  };

  export const getToken = () => {
    return localStorage.getItem(KEYS.AUTH_TOKEN);
  };

  export const removeToken = () => {
    localStorage.removeItem(KEYS.AUTH_TOKEN);
  };

  export const setCurrentUser = (user) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  };

  export const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem(KEYS.CURRENT_USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  export const removeCurrentUser = () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  };

  export const isAuthenticated = () => {
    return !!getToken();
  };

  export const clearAuth = () => {
    removeToken();
    removeCurrentUser();
  };

  export const getUserRole = () => {
    const user = getCurrentUser();
    return user ? user.role : null;
  };
  
  export const logout = () => {
    clearAuth();
  };
  