const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test registration
    console.log('\n1. Testing user registration:');
    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        bloodGroup: 'O+',
        phone: '1234567890',
        address: '123 Test St'
      });
      console.log('Registration successful:', registerResponse.data);
      
      // Store token for subsequent requests
      const token = registerResponse.data.token;
      
      // Test getting user profile
      console.log('\n2. Testing get user profile:');
      const profileResponse = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Profile retrieved:', profileResponse.data);
      
      // Test creating a donor profile
      console.log('\n3. Testing donor registration:');
      const donorResponse = await axios.post(`${API_URL}/donors`, {
        organs: ['kidneys', 'liver'],
        medicalHistory: 'No major health issues',
        location: {
          type: 'Point',
          coordinates: [-73.935242, 40.730610]
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Donor registration successful:', donorResponse.data);
      
      // Test creating a transplant request
      console.log('\n4. Testing transplant request creation:');
      const requestResponse = await axios.post(`${API_URL}/requests`, {
        organType: 'kidneys',
        bloodGroup: 'O+',
        urgency: 'high',
        hospital: {
          name: 'Test Hospital',
          address: '456 Hospital Ave',
          contact: '9876543210'
        },
        medicalDetails: {
          diagnosis: 'Kidney failure',
          additionalNotes: 'Urgent need for transplant'
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Request creation successful:', requestResponse.data);
      
      // Test getting user's requests
      console.log('\n5. Testing get user requests:');
      const requestsResponse = await axios.get(`${API_URL}/requests/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User requests retrieved:', requestsResponse.data);
      
      console.log('\nAll tests completed successfully!');
    } catch (error) {
      console.error('Error during API testing:');
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  } catch (error) {
    console.error('Error connecting to API:', error.message);
  }
}

testAPI(); 