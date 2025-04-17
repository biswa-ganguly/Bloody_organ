const DonationStats = () => {
    // In real app, these would come from API/backend
    const stats = [
      { label: 'Blood Donors', value: '1,254' },
      { label: 'Organ Donors', value: '487' },
      { label: 'Successful Transplants', value: '326' },
      { label: 'Lives Saved', value: '842' },
    ];
    
    return (
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default DonationStats;
  