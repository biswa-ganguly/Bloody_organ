import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const TransplantRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [donors, setDonors] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    requestType: 'all',
    urgency: 'all',
    searchTerm: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  // Load requests and donors when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all requests
        const requestsResponse = await axios.get(`${API_URL}/requests`, { headers });
        setRequests(requestsResponse.data);
        setFilteredRequests(requestsResponse.data);

        // Fetch all donors
        const donorsResponse = await axios.get(`${API_URL}/donors`, { headers });
        setDonors(donorsResponse.data);

        setLoading(false);
      } catch (error) {
        setMessage({ 
          text: error.response?.data?.message || 'Failed to load data', 
          type: 'error' 
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when requests or filters change
  useEffect(() => {
    let results = [...requests];
    
    // Filter by status
    if (filters.status !== 'all') {
      results = results.filter(request => request.status === filters.status);
    }
    
    // Filter by request type
    if (filters.requestType !== 'all') {
      results = results.filter(request => request.requestType === filters.requestType);
    }
    
    // Filter by urgency
    if (filters.urgency !== 'all') {
      results = results.filter(request => request.urgencyLevel === filters.urgency);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        request => request.patientFirstName.toLowerCase().includes(searchLower) || 
                   request.patientLastName.toLowerCase().includes(searchLower) ||
                   request.contactEmail.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredRequests(results);
  }, [requests, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Update request status via API
      await axios.patch(`${API_URL}/requests/${requestId}/status`, 
        { status: newStatus },
        { headers }
      );
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request._id === requestId ? { ...request, status: newStatus } : request
        )
      );
      
      setMessage({ 
        text: `Request status updated to ${newStatus} successfully`, 
        type: 'success' 
      });
      
      // Close match modal if open
      if (matchOpen) {
        setMatchOpen(false);
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update request status', 
        type: 'error' 
      });
    }
  };

  const openMatchModal = (request) => {
    setSelectedRequest(request);
    setMatchOpen(true);
  };

  // Filter compatible donors based on the selected request
  const compatibleDonors = selectedRequest ? donors.filter(donor => {
    // Filter out non-approved donors
    if (donor.status !== 'approved') return false;
    
    // Blood request matching
    if (selectedRequest.requestType === 'blood') {
      if (donor.donationType !== 'blood' && donor.donationType !== 'both') return false;
      
      // Blood type compatibility check (simplified for demo)
      // In a real app, this would be more comprehensive
      if (selectedRequest.patientBloodType && donor.bloodType) {
        // Exact match or universal donor (O-)
        return selectedRequest.patientBloodType === donor.bloodType || donor.bloodType === 'O-';
      }
      return true;
    }
    
    // Organ request matching
    if (selectedRequest.requestType === 'organ') {
      if (donor.donationType !== 'organ' && donor.donationType !== 'both') return false;
      
      // Match organ type
      return !selectedRequest.organNeeded || !donor.organType || 
             selectedRequest.organNeeded === donor.organType || 
             donor.organType === 'multiple';
    }
    
    return true;
  }) : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transplant Request Management</h1>
      
      {/* Message display */}
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="matched">Matched</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
            <select
              name="requestType"
              value={filters.requestType}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="blood">Blood</option>
              <option value="organ">Organ</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Urgency Levels</option>
              <option value="emergency">Emergency</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search by patient name or email"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.patientFirstName} {request.patientLastName}
                      </div>
                      {request.patientAge && (
                        <div className="text-xs text-gray-500">
                          Age: {request.patientAge}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.contactEmail}</div>
                      <div className="text-xs text-gray-500">{request.contactPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {request.requestType === 'blood' ? 'Blood' : 
                         request.requestType === 'organ' ? `Organ (${request.organNeeded})` : ''}
                      </div>
                      {request.hospital && (
                        <div className="text-xs text-gray-500">
                          {request.hospital.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${request.urgencyLevel === 'emergency' ? 'bg-red-100 text-red-800' : 
                         request.urgencyLevel === 'urgent' ? 'bg-orange-100 text-orange-800' : 
                         request.urgencyLevel === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {request.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${request.status === 'matched' ? 'bg-green-100 text-green-800' : 
                         request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(request._id, 'matched')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Match
                            </button>
                            <button
                              onClick={() => handleStatusChange(request._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {request.status === 'matched' && (
                          <button
                            onClick={() => handleStatusChange(request._id, 'completed')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Mark Completed
                          </button>
                        )}
                        <button
                          onClick={() => openMatchModal(request)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No requests found matching the criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Modal */}
      {matchOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Request Details</h3>
              <button
                onClick={() => setMatchOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Patient Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {selectedRequest.patientFirstName} {selectedRequest.patientLastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{selectedRequest.patientAge}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Type</p>
                  <p className="font-medium">{selectedRequest.patientBloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{selectedRequest.contactPhone}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Hospital Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{selectedRequest.hospital.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{selectedRequest.hospital.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{selectedRequest.hospital.contact}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Medical Details</h4>
              <div>
                <p className="text-sm text-gray-600">Diagnosis</p>
                <p className="font-medium">{selectedRequest.medicalDetails.diagnosis}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">Additional Notes</p>
                <p className="font-medium">{selectedRequest.medicalDetails.additionalNotes}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Compatible Donors</h4>
              {compatibleDonors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blood Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organs
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {compatibleDonors.map((donor) => (
                        <tr key={donor._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {donor.firstName} {donor.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{donor.bloodType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {donor.organType || 'Not specified'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                handleStatusChange(selectedRequest._id, 'matched');
                                // Here you would typically update the donor's status as well
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Match
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No compatible donors found</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMatchOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransplantRequests;