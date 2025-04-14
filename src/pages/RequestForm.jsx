import { useState } from 'react';
import { addRequest } from '../services/localStorageService';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    patientFirstName: '',
    patientLastName: '',
    contactEmail: '',
    contactPhone: '',
    patientAge: '',
    patientBloodType: '',
    requestType: 'blood', // Default to blood request
    organNeeded: '',
    hospitalName: '',
    doctorName: '',
    doctorContact: '',
    urgencyLevel: 'normal',
    medicalDetails: '',
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
    if (!formData.patientFirstName || !formData.patientLastName || !formData.contactEmail || !formData.contactPhone) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.consentGiven) {
      setError('You must consent to the request terms');
      return;
    }

    try {
      // Save request to local storage
      addRequest(formData);
      setSubmitted(true);
      setError('');
      
      // Reset form after submission
      setFormData({
        patientFirstName: '',
        patientLastName: '',
        contactEmail: '',
        contactPhone: '',
        patientAge: '',
        patientBloodType: '',
        requestType: 'blood',
        organNeeded: '',
        hospitalName: '',
        doctorName: '',
        doctorContact: '',
        urgencyLevel: 'normal',
        medicalDetails: '',
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
          <p className="font-bold">Request Submitted Successfully!</p>
          <p>Your transplant request has been submitted. Our team will review your request and contact you as soon as possible.</p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition duration-300"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transplant Request Form</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientFirstName">
              Patient First Name <span className="text-red-600">*</span>
            </label>
            <input
              id="patientFirstName"
              name="patientFirstName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.patientFirstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientLastName">
              Patient Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="patientLastName"
              name="patientLastName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.patientLastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactEmail">
              Contact Email <span className="text-red-600">*</span>
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPhone">
              Contact Phone <span className="text-red-600">*</span>
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.contactPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientAge">
              Patient Age
            </label>
            <input
              id="patientAge"
              name="patientAge"
              type="number"
              min="0"
              max="120"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.patientAge}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientBloodType">
              Blood Type
            </label>
            <select
              id="patientBloodType"
              name="patientBloodType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.patientBloodType}
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
            Request Type <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="requestType"
                value="blood"
                checked={formData.requestType === 'blood'}
                onChange={handleChange}
                className="form-radio text-red-600"
              />
              <span className="ml-2">Blood</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="requestType"
                value="organ"
                checked={formData.requestType === 'organ'}
                onChange={handleChange}
                className="form-radio text-red-600"
              />
              <span className="ml-2">Organ</span>
            </label>
          </div>
        </div>
        
        {formData.requestType === 'organ' && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organNeeded">
              Organ Needed
            </label>
            <select
              id="organNeeded"
              name="organNeeded"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.organNeeded}
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
            </select>
          </div>
        )}
        
        <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Medical Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hospitalName">
              Hospital Name
            </label>
            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.hospitalName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctorName">
              Doctor's Name
            </label>
            <input
              id="doctorName"
              name="doctorName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.doctorName}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="urgencyLevel">
            Urgency Level
          </label>
          <select
            id="urgencyLevel"
            name="urgencyLevel"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.urgencyLevel}
            onChange={handleChange}
          >
            <option value="low">Low - Scheduled need</option>
            <option value="normal">Normal - Needed soon</option>
            <option value="urgent">Urgent - Critical need</option>
            <option value="emergency">Emergency - Life-threatening</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="medicalDetails">
            Medical Details
          </label>
          <textarea
            id="medicalDetails"
            name="medicalDetails"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="Please provide any relevant medical details about the patient's condition"
            value={formData.medicalDetails}
            onChange={handleChange}
          ></textarea>
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
              I consent to the sharing of this information with potential donors and medical professionals. <span className="text-red-600">*</span>
            </span>
          </label>
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
