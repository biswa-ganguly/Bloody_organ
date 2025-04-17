import { Link } from 'react-router-dom';
import DonationStats from '../components/DonationStats';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Give the Gift of Life</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of donors and help save lives through blood and organ donation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/donor-registration" 
              className="bg-white text-red-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
            >
              Become a Donor
            </Link>
            <Link 
              to="/request-transplant" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-red-600 transition duration-300"
            >
              Request Transplant
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <DonationStats />
      
      {/* Information Sections */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Blood Donation</h2>
              <p className="text-gray-600 mb-4">
                Blood donation is a simple process that takes about 10-15 minutes. One donation can save up to three lives, making it one of the most impactful ways to help others.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Every two seconds someone needs blood</li>
                <li>A single car accident victim can require as many as 100 units of blood</li>
                <li>Blood cannot be manufactured – it can only come from generous donors</li>
              </ul>
              <Link 
                to="/donor-registration" 
                className="inline-block bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition duration-300"
              >
                Donate Blood Now
              </Link>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Organ Donation</h2>
              <p className="text-gray-600 mb-4">
                Organ donation is the process of giving an organ or a part of an organ for the purpose of transplantation into another person. One organ donor can save up to eight lives.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>More than 100,000 people are waiting for an organ transplant</li>
                <li>17 people die each day waiting for an organ transplant</li>
                <li>Every 10 minutes another person is added to the waiting list</li>
              </ul>
              <Link 
                to="/donor-registration" 
                className="inline-block bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition duration-300"
              >
                Register as an Organ Donor
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to donate or in need of a transplant, our platform connects those who can help with those who need it.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/donor-registration" 
              className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition duration-300"
            >
              Register Now
            </Link>
            <Link 
              to="/about" 
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
