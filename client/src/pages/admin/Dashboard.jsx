import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDonors, getAllRequests } from '../../services/localStorageService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    pendingDonors: 0,
    approvedDonors: 0,
    totalRequests: 0,
    pendingRequests: 0,
    matchedRequests: 0,
    bloodDonors: 0,
    organDonors: 0
  });

  // Load stats when component mounts
  useEffect(() => {
    const donors = getAllDonors();
    const requests = getAllRequests();
    
    setStats({
      totalDonors: donors.length,
      pendingDonors: donors.filter(d => d.status === 'pending').length,
      approvedDonors: donors.filter(d => d.status === 'approved').length,
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      matchedRequests: requests.filter(r => r.status === 'matched').length,
      bloodDonors: donors.filter(d => d.donationType === 'blood' || d.donationType === 'both').length,
      organDonors: donors.filter(d => d.donationType === 'organ' || d.donationType === 'both').length
    });
  }, []);

  // Get recent donors and requests
  const recentDonors = getAllDonors().slice(0, 5);
  const recentRequests = getAllRequests().slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Donors</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalDonors}</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">{stats.approvedDonors} Approved</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-yellow-500 text-sm font-medium">{stats.pendingDonors} Pending</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalRequests}</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm font-medium">{stats.matchedRequests} Matched</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-yellow-500 text-sm font-medium">{stats.pendingRequests} Pending</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Blood Donors</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.bloodDonors}</p>
          <div className="flex items-center mt-2">
            <span className="text-red-500 text-sm font-medium">
              {Math.round((stats.bloodDonors / stats.totalDonors) * 100) || 0}% of total
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Organ Donors</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.organDonors}</p>
          <div className="flex items-center mt-2">
            <span className="text-red-500 text-sm font-medium">
              {Math.round((stats.organDonors / stats.totalDonors) * 100) || 0}% of total
            </span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-gray-800 text-lg font-medium mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/admin/donors" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
          >
            View All Donors
          </Link>
          <Link 
            to="/admin/requests" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200"
          >
            View All Requests
          </Link>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition duration-200">
            Generate Reports
          </button>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200">
            Send Notifications
          </button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donors */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 text-lg font-medium">Recent Donors</h2>
            <Link to="/admin/donors" className="text-blue-500 hover:text-blue-700">View All</Link>
          </div>
          
          {recentDonors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDonors.map((donor, index) => (
                    <tr key={donor.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {donor.firstName} {donor.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {donor.donationType}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${donor.status === 'approved' ? 'bg-green-100 text-green-800' : 
                           donor.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {donor.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(donor.registrationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No donors registered yet.</p>
          )}
        </div>
        
        {/* Recent Requests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 text-lg font-medium">Recent Requests</h2>
            <Link to="/admin/requests" className="text-blue-500 hover:text-blue-700">View All</Link>
          </div>
          
          {recentRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request, index) => (
                    <tr key={request.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {request.patientFirstName} {request.patientLastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {request.requestType === 'blood' ? 'Blood' : 
                         request.requestType === 'organ' ? `Organ (${request.organNeeded})` : ''}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${request.urgencyLevel === 'emergency' ? 'bg-red-100 text-red-800' : 
                           request.urgencyLevel === 'urgent' ? 'bg-orange-100 text-orange-800' : 
                           request.urgencyLevel === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {request.urgencyLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${request.status === 'matched' ? 'bg-green-100 text-green-800' : 
                           request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No transplant requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
