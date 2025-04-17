import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';

const API_URL = 'http://localhost:5000/api';

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(user || null);
  const [donorStatus, setDonorStatus] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user profile
        const profileResponse = await axios.get(`${API_URL}/users/profile`, { headers });
        setProfile(profileResponse.data);

        // Fetch donor status
        try {
          const donorResponse = await axios.get(`${API_URL}/donors/my-profile`, { headers });
          setDonorStatus(donorResponse.data);
        } catch (error) {
          if (error.response?.status !== 404) {
            throw error;
          }
        }

        // Fetch user's requests
        const requestsResponse = await axios.get(`${API_URL}/requests/my-requests`, { headers });
        setRequests(requestsResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          {profile && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Group</p>
                <p className="font-medium">{profile.bloodGroup}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{profile.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Donor Status Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Donor Status</h2>
          {donorStatus ? (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">Registered Organs</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {donorStatus.organs.map((organ, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {organ}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600">Medical History</p>
                <p className="mt-1">{donorStatus.medicalHistory}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You are not registered as a donor</p>
              <button
                onClick={() => navigate('/donor-registration')}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Register as Donor
              </button>
            </div>
          )}
        </div>

        {/* Transplant Requests Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Transplant Requests</h2>
            <button
              onClick={() => navigate('/request-form')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              New Request
            </button>
          </div>
          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organ Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Urgency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.organType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${request.urgency === 'high' ? 'bg-red-100 text-red-800' : 
                              request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}
                        >
                          {request.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.hospital}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${request.status === 'matched' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {request.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600 py-4">No transplant requests found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 