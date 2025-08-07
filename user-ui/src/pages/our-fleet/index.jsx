import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const OurFleet = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('cabBookerUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cabBookerUser', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const fleetCategories = [
    { id: 'all', name: 'All Vehicles', icon: 'Car' },
    { id: 'hatchback', name: 'Hatchback', icon: 'Car' },
    { id: 'sedan', name: 'Sedan', icon: 'Car' },
    { id: 'suv', name: 'SUV/MUV', icon: 'Truck' },
    { id: 'luxury', name: 'Luxury', icon: 'Star' }
  ];

  const vehicles = [
    // Hatchback
    {
      id: 1,
      category: 'hatchback',
      name: 'Maruti Swift',
      image: '/vehicles/swift.jpg',
      seating: 4,
      features: ['AC', 'Music System', 'GPS'],
      priceRange: '₹8-10/km',
      fuel: 'Petrol/CNG',
      description: 'Perfect for city rides and short trips. Compact yet comfortable.'
    },
    {
      id: 2,
      category: 'hatchback',
      name: 'Hyundai i20',
      image: '/vehicles/i20.jpg',
      seating: 4,
      features: ['AC', 'Music System', 'Power Steering'],
      priceRange: '₹9-11/km',
      fuel: 'Petrol',
      description: 'Modern hatchback with excellent fuel efficiency and comfort.'
    },
    
    // Sedan
    {
      id: 3,
      category: 'sedan',
      name: 'Maruti Dzire',
      image: '/vehicles/dzire.jpg',
      seating: 4,
      features: ['AC', 'Music System', 'GPS', 'Power Windows'],
      priceRange: '₹10-12/km',
      fuel: 'Petrol/CNG',
      description: 'Most popular sedan choice. Comfortable and fuel-efficient.'
    },
    {
      id: 4,
      category: 'sedan',
      name: 'Honda City',
      image: '/vehicles/city.jpg',
      seating: 4,
      features: ['AC', 'Music System', 'GPS', 'Sunroof'],
      priceRange: '₹12-15/km',
      fuel: 'Petrol',
      description: 'Premium sedan experience with advanced features.'
    },
    
    // SUV
    {
      id: 5,
      category: 'suv',
      name: 'Toyota Innova',
      image: '/vehicles/innova.jpg',
      seating: 7,
      features: ['AC', 'Music System', 'GPS', 'Captain Seats'],
      priceRange: '₹15-18/km',
      fuel: 'Diesel',
      description: 'Spacious SUV perfect for family trips and group travel.'
    },
    {
      id: 6,
      category: 'suv',
      name: 'Mahindra XUV500',
      image: '/vehicles/xuv500.jpg',
      seating: 7,
      features: ['AC', 'Music System', 'GPS', 'Touchscreen'],
      priceRange: '₹16-20/km',
      fuel: 'Diesel',
      description: 'Powerful SUV with modern amenities and comfortable seating.'
    },
    
    // Luxury
    {
      id: 7,
      category: 'luxury',
      name: 'BMW 3 Series',
      image: '/vehicles/bmw3.jpg',
      seating: 4,
      features: ['Premium AC', 'Premium Sound', 'GPS', 'Leather Seats'],
      priceRange: '₹25-30/km',
      fuel: 'Petrol',
      description: 'Ultimate luxury experience with premium features and comfort.'
    },
    {
      id: 8,
      category: 'luxury',
      name: 'Mercedes E-Class',
      image: '/vehicles/mercedes-e.jpg',
      seating: 4,
      features: ['Climate Control', 'Premium Sound', 'Massage Seats', 'Ambient Lighting'],
      priceRange: '₹30-35/km',
      fuel: 'Petrol',
      description: 'Top-tier luxury sedan for the most discerning travelers.'
    }
  ];

  const filteredVehicles = selectedCategory === 'all' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.category === selectedCategory);

  const stats = [
    { icon: 'Car', label: 'Total Vehicles', value: '2,500+' },
    { icon: 'Shield', label: 'Safety Rating', value: '4.8/5' },
    { icon: 'Settings', label: 'Maintenance', value: '24/7' },
    { icon: 'Clock', label: 'Avg. Age', value: '<3 Years' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onAuthRequired={handleAuthRequired}
      />
      
      <main className="pt-4 pb-20 md:pb-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
            <h1 className="fluid-text-4xl font-bold text-foreground mb-6">
              Our Fleet
            </h1>
            <p className="fluid-text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover our diverse range of well-maintained vehicles, from budget-friendly hatchbacks 
              to luxury sedans. Every vehicle in our fleet is regularly serviced and thoroughly 
              inspected to ensure your safety and comfort.
            </p>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-12 bg-muted/30"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name={stat.icon} size={24} color="white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Fleet Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-12"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {fleetCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all
                    ${selectedCategory === category.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-card-foreground hover:border-primary/50'
                    }
                  `}
                >
                  <Icon name={category.icon} size={20} />
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Vehicle Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pb-16"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover-lift"
                >
                  {/* Vehicle Image */}
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name="Car" size={48} className="text-muted-foreground" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${vehicle.category === 'luxury' ? 'bg-amber-500 text-white' :
                          vehicle.category === 'suv' ? 'bg-green-500 text-white' :
                          vehicle.category === 'sedan' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }
                      `}>
                        {fleetCategories.find(cat => cat.id === vehicle.category)?.name}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {vehicle.description}
                    </p>

                    {/* Vehicle Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Seating</span>
                        <span className="font-medium">{vehicle.seating} passengers</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fuel Type</span>
                        <span className="font-medium">{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price Range</span>
                        <span className="font-medium text-primary">{vehicle.priceRange}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <motion.a
                      href="/trip-booking-form"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full bg-primary text-primary-foreground text-center py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Book Now
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="py-16 lg:py-24 bg-muted/30"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="fluid-text-3xl font-bold text-foreground mb-4">
                Why Choose Our Fleet?
              </h2>
              <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto">
                Every vehicle in our fleet meets our high standards for safety, comfort, and reliability
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} color="white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Safety First</h3>
                <p className="text-muted-foreground">
                  All vehicles undergo regular safety inspections and are equipped with GPS tracking, 
                  emergency buttons, and safety features.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="Settings" size={32} color="white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Well Maintained</h3>
                <p className="text-muted-foreground">
                  Regular servicing, professional cleaning, and quality checks ensure every 
                  ride is comfortable and reliable.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="Zap" size={32} color="white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Modern Features</h3>
                <p className="text-muted-foreground">
                  Air conditioning, music systems, GPS navigation, and phone charging ports 
                  come standard across our fleet.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation 
        user={user} 
        onAuthRequired={handleAuthRequired}
      />
    </div>
  );
};

export default OurFleet;