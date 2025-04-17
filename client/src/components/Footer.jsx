const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">LifeShare</h3>
              <p className="text-gray-300">Connecting donors with those in need</p>
            </div>
            
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="text-gray-300">
                <li className="mb-1"><a href="/" className="hover:text-red-300">Home</a></li>
                <li className="mb-1"><a href="/donor-registration" className="hover:text-red-300">Become a Donor</a></li>
                <li className="mb-1"><a href="/request-transplant" className="hover:text-red-300">Request Transplant</a></li>
                <li className="mb-1"><a href="/about" className="hover:text-red-300">About</a></li>
              </ul>
            </div>
            
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Contact</h4>
              <address className="text-gray-300 not-italic">
                <p>Email: contact@lifeshare.org</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Hope Street, Cityville</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LifeShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  