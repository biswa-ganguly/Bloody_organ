import { useState } from 'react';
import { addDonor } from '../services/localStorageService';

const DonorRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    bloodType: '',
    donationType: 'blood', // Default to blood donation
    organType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    consentGiven: false
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.consentGiven) {
      setError('You must consent to the donation terms');
      return;
    }
    
    try {
      // Save donor to local storage
      addDonor(formData);
      setSubmitted(true);
      setError('');
      
      // Reset form after submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        bloodType: '',
        donationType: 'blood',
        organType: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        medicalHistory: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        consentGiven: false
      });
      
      // Scroll to top for success message
      window.scrollTo(0, 0);
    } catch (err) {
      setError('Error submitting form. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto my-12 px-4">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Thank you for registering!</p>
          <p>Your donor registration has been submitted successfully. We'll contact you soon with next steps.</p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition duration-300"
        >
          Register Another Donor
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Donor Registration</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
              Date of Birth
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bloodType">
              Blood Type
            </label>
            <select
              id="bloodType"
              name="bloodType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.bloodType}
              onChange={handleChange}
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Donation Type <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="donationType"
                value="blood"
                checked={formData.donationType === 'blood'}
                onChange={handleChange}
                className="form-radio text-red-600"
              />
              <span className="ml-2">Blood</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="donationType"
                value="organ"
                checked={formData.donationType === 'organ'}
                onChange={handleChange}
                className="form-radio text-red-600"
              />
              <span className="ml-2">Organ</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="donationType"
                value="both"
                checked={formData.donationType === 'both'}
                onChange={handleChange}
                className="form-radio text-red-600"
              />
              <span className="ml-2">Both</span>
            </label>
          </div>
        </div>
        
        {(formData.donationType === 'organ' || formData.donationType === 'both') && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organType">
              Organ Type
            </label>
            <select
              id="organType"
              name="organType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.organType}
              onChange={handleChange}
            >
              <option value="">Select Organ</option>
              <option value="kidney">Kidney</option>
              <option value="liver">Liver</option>
              <option value="heart">Heart</option>
              <option value="lung">Lung</option>
              <option value="pancreas">Pancreas</option>
              <option value="cornea">Cornea</option>
              <option value="bone_marrow">Bone Marrow</option>
              <option value="tissue">Tissue</option>
              <option value="multiple">Multiple Organs</option>
            </select>
          </div>
        )}
        
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Address Information</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Street Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
              ZIP Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Medical Information</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="medicalHistory">
            Relevant Medical History
          </label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Please share any relevant medical history or conditions"
            value={formData.medicalHistory}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Emergency Contact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergencyContactName">
              Emergency Contact Name
            </label>
            <input
              id="emergencyContactName"
              name="emergencyContactName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.emergencyContactName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergencyContactPhone">
              Emergency Contact Phone
            </label>
            <input
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              type="tel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="consentGiven"
              checked={formData.consentGiven}
              onChange={handleChange}
              className="form-checkbox text-red-600"
              required
            />
            <span className="ml-2 text-gray-700">
              I consent to the donation process and allow LifeShare to contact me regarding my donation. <span className="text-red-600">*</span>
            </span>
          </label>
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonorRegistration;
