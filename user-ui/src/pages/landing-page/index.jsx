import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import TripStatusIndicator from '../../components/ui/TripStatusIndicator';
import HeroSection from './components/HeroSection';
import TripTypeCard from './components/TripTypeCard';
import PackageCard from './components/PackageCard';
import TestimonialCard from './components/TestimonialCard';
import TrustSignals from './components/TrustSignals';
import Footer from './components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedTripType, setSelectedTripType] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);

  // Mock data for packages
  const featuredPackages = [
    {
      id: 'goa-beach-tour',
      title: 'Goa Beach Paradise',
      destination: 'Goa',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '3 Days 2 Nights',
      price: 12999,
      originalPrice: 15999,
      rating: 4.8,
      reviewCount: 234,
      highlights: [
        'Beach resort accommodation',
        'Water sports activities',
        'Local sightseeing tours',
        'Complimentary breakfast'
      ],
      isPopular: true
    },
    {
      id: 'rajasthan-heritage',
      title: 'Rajasthan Heritage Tour',
      destination: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '5 Days 4 Nights',
      price: 24999,
      originalPrice: 29999,
      rating: 4.9,
      reviewCount: 189,
      highlights: [
        'Palace and fort visits',
        'Desert safari experience',
        'Cultural performances',
        'Heritage hotel stays'
      ]
    },
    {
      id: 'kerala-backwaters',
      title: 'Kerala Backwaters',
      destination: 'Kerala',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '4 Days 3 Nights',
      price: 18999,
      originalPrice: 22999,
      rating: 4.7,
      reviewCount: 156,
      highlights: [
        'Houseboat accommodation',
        'Backwater cruises',
        'Ayurvedic spa treatments',
        'Traditional Kerala cuisine'
      ]
    },
    {
      id: 'himachal-adventure',
      title: 'Himachal Adventure',
      destination: 'Himachal Pradesh',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      duration: '6 Days 5 Nights',
      price: 21999,
      originalPrice: 26999,
      rating: 4.6,
      reviewCount: 203,
      highlights: [
        'Mountain trekking',
        'Adventure activities',
        'Hill station visits',
        'Local cuisine experiences'
      ]
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      name: 'Priya Sharma',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      rating: 5,
      review: 'Excellent service! The driver was punctual and the car was clean. Booked for airport transfer and it was hassle-free.',
      tripType: 'Airport',
      location: 'Mumbai'
    },
    {
      name: 'Rajesh Kumar',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5,
      review: 'Used CabBooker for our Goa trip package. Everything was well organized and the experience was amazing.',
      tripType: 'Package Tour',
      location: 'Delhi'
    },
    {
      name: 'Anita Patel',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 4,
      review: 'Great for local trips around the city. The hourly package is very convenient for shopping and meetings.',
      tripType: 'Local',
      location: 'Bangalore'
    }
  ];

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('cabBookerUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Check for active trip
    const savedTrip = localStorage.getItem('activeTrip');
    if (savedTrip) {
      setActiveTrip(JSON.parse(savedTrip));
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cabBookerUser', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/trip-booking-form');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleTripTypeSelect = (tripType) => {
    setSelectedTripType(tripType);
    if (user) {
      navigate(`/trip-booking-form?type=${tripType}`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handlePackageBookNow = (packageData) => {
    if (user) {
      navigate(`/trip-booking-form?package=${packageData?.id}`);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleViewTripDetails = () => {
    navigate('/trip-history');
  };

  const handleContactDriver = () => {
    // Mock contact driver functionality
    alert('Calling driver...');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        user={user}
        onAuthRequired={() => setIsAuthModalOpen(true)}
      />
      {/* Trip Status Indicator */}
      <TripStatusIndicator
        activeTrip={activeTrip}
        onViewDetails={handleViewTripDetails}
        onContactDriver={handleContactDriver}
      />
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection onGetStarted={handleGetStarted} />

        {/* Trip Types Section */}
        <section className="py-16 lg:py-24 bg-surface">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="fluid-text-2xl lg:text-4xl font-bold text-foreground mb-4">
                Choose Your Ride Type
              </h2>
              <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto">
                Select from our range of services designed to meet your travel needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['one-way', 'round-trip', 'local', 'airport']?.map((tripType, index) => (
                <TripTypeCard
                  key={tripType}
                  tripType={tripType}
                  isSelected={selectedTripType === tripType}
                  onSelect={handleTripTypeSelect}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Packages Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="fluid-text-2xl lg:text-4xl font-bold text-foreground mb-4">
                Featured Tour Packages
              </h2>
              <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover amazing destinations with our curated travel packages
              </p>
            </motion.div>

            {/* Mobile Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {featuredPackages?.map((pkg, index) => (
                  <PackageCard
                    key={pkg?.id}
                    packageData={pkg}
                    index={index}
                    onBookNow={handlePackageBookNow}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredPackages?.map((pkg, index) => (
                <PackageCard
                  key={pkg?.id}
                  packageData={pkg}
                  index={index}
                  onBookNow={handlePackageBookNow}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <button
                onClick={() => navigate('/package-tours-catalog')}
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                <span>View All Packages</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </button>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 bg-surface">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="fluid-text-2xl lg:text-4xl font-bold text-foreground mb-4">
                What Our Customers Say
              </h2>
              <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto">
                Real experiences from thousands of satisfied customers
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials?.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial?.name}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <TrustSignals />

        {/* Footer */}
        <Footer />
      </main>
      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation
        user={user}
        onAuthRequired={() => setIsAuthModalOpen(true)}
      />
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;