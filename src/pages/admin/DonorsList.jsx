import { useState, useEffect } from 'react';
import { getAllDonors, updateDonorStatus } from '../../services/localStorageService';

const DonorsList = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    donationType: 'all',
    searchTerm: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load donors when component mounts
  useEffect(() => {
    const loadedDonors = getAllDonors();
    setDonors(loadedDonors);
    setFilteredDonors(loadedDonors);
  }, []);

  // Apply filters when donors or filters change
  useEffect(() => {
    let results = [...donors];
    
    // Filter by status
    if (filters.status !== 'all') {
      results = results.filter(donor => donor.status === filters.status);
    }
    
    // Filter by donation type
    if (filters.donationType !== 'all') {
      results = results.filter(donor => donor.donationType === filters.donationType || donor.donationType === 'both');
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(
        donor => donor.firstName.toLowerCase().includes(searchLower) || 
                donor.lastName.toLowerCase().includes(searchLower) ||
                donor.email.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredDonors(results);
  }, [donors, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (donorId, newStatus) => {
    try {
      // Update donor status
      updateDonorStatus(donorId, newStatus);
      
      // Update local state
      setDonors(prevDonors => 
        prevDonors.map(donor => 
          donor.id === donorId ? { ...donor, status: newStatus } : donor
        )
      );
      
      setMessage({ 
        text: `Donor status updated to ${newStatus} successfully`, 
        type: 'success' 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ 
        text: 'Failed to update donor status', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Donor Management</h1>
      
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type</label>
            <select
              name="donationType"
              value={filters.donationType}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="blood">Blood</option>
              <option value="organ">Organ</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search by name or email"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Donors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donation Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
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
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {donor.firstName} {donor.lastName}
                      </div>
                      {donor.bloodType && (
                        <div className="text-xs text-gray-500">
                          Blood Type: {donor.bloodType}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donor.email}</div>
                      <div className="text-xs text-gray-500">{donor.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{donor.donationType}</div>
                      {donor.donationType === 'organ' || donor.donationType === 'both' ? (
                        <div className="text-xs text-gray-500 capitalize">
                          {donor.organType || 'Not specified'}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donor.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${donor.status === 'approved' ? 'bg-green-100 text-green-800' : 
                         donor.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {donor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {donor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(donor.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(donor.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {donor.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(donor.id, 'pending')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Mark Pending
                          </button>
                        )}
                        {donor.status === 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(donor.id, 'pending')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Review Again
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No donors found matching the criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonorsList;
