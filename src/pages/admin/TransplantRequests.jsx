import { useState, useEffect } from 'react';
import { getAllRequests, updateRequestStatus, getAllDonors } from '../../services/localStorageService';

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

  // Load requests and donors when component mounts
  useEffect(() => {
    const loadedRequests = getAllRequests();
    const loadedDonors = getAllDonors();
    setRequests(loadedRequests);
    setFilteredRequests(loadedRequests);
    setDonors(loadedDonors);
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
      // Update request status
      updateRequestStatus(requestId, newStatus);
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId ? { ...request, status: newStatus } : request
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
        text: 'Failed to update request status', 
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
                  <tr key={request.id}>
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
                         `Organ (${request.organNeeded})`}
                      </div>
                      {request.patientBloodType && (
                        <div className="text-xs text-gray-500">
                          Blood Type: {request.patientBloodType}
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
                        ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                         request.status === 'matched' ? 'bg-blue-100 text-blue-800' : 
                         request.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => openMatchModal(request)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Find Match
                        </button>
                      )}
                      {request.status !== 'rejected' && request.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'completed')}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          Complete
                        </button>
                      )}
                      {request.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    No requests found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Match Donor Modal */}
      {matchOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Find Matching Donor</h2>
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
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Request Details:</h3>
              <p><span className="font-medium">Patient:</span> {selectedRequest.patientFirstName} {selectedRequest.patientLastName}</p>
              <p><span className="font-medium">Type:</span> {selectedRequest.requestType === 'blood' ? 'Blood' : `Organ (${selectedRequest.organNeeded})`}</p>
              {selectedRequest.patientBloodType && (
                <p><span className="font-medium">Blood Type:</span> {selectedRequest.patientBloodType}</p>
              )}
              <p><span className="font-medium">Urgency:</span> {selectedRequest.urgencyLevel}</p>
            </div>
            
            <h3 className="font-medium mb-2">Compatible Donors:</h3>
            {compatibleDonors.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {compatibleDonors.map(donor => (
                      <tr key={donor.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{donor.firstName} {donor.lastName}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {donor.bloodType && <span>Blood: {donor.bloodType}</span>}
                            {donor.organType && <span>Organ: {donor.organType}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              // Update the request status to matched
                              handleStatusChange(selectedRequest.id, 'matched');
                              // In a real app, you would also update the donor status and create a match record
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No compatible donors found.</p>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setMatchOpen(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransplantRequests;