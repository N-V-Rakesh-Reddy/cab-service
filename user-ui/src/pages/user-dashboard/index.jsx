import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../utils/api';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import TripStatusIndicator from '../../components/ui/TripStatusIndicator';
import AuthModal from '../../components/ui/AuthModal';
import WelcomeSection from './components/WelcomeSection';
import CurrentTripCard from './components/CurrentTripCard';
import QuickActionCards from './components/QuickActionCards';
import RecentActivitySection from './components/RecentActivitySection';
import NotificationArea from './components/NotificationArea';
import ProfileCompletionPrompt from './components/ProfileCompletionPrompt';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTrip, setActiveTrip] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    emergencyContact: null,
    address: null,
    dateOfBirth: null,
    profileImage: null
  };

  // Mock active trip data
  const mockActiveTrip = {
    id: "TRP001",
    status: "confirmed",
    pickup: "Bandra West, Mumbai",
    destination: "Andheri East, Mumbai",
    fare: 450,
    distance: 12.5,
    eta: 8,
    driver: {
      name: "Suresh Patil",
      phone: "+91 87654 32109",
      vehicle: "Maruti Swift Dzire",
      plateNumber: "MH 02 AB 1234",
      rating: 4.8
    },
    trackingUrl: "https://maps.google.com/track/trip001"
  };

  // Mock recent trips data
  const mockRecentTrips = [
    {
      id: "TRP002",
      pickup: "Home",
      destination: "Office",
      date: "2025-08-01T09:30:00",
      fare: 280,
      distance: 8.2,
      status: "completed",
      rated: true,
      rating: 5
    },
    {
      id: "TRP003",
      pickup: "Phoenix Mall",
      destination: "Juhu Beach",
      date: "2025-07-31T18:45:00",
      fare: 320,
      distance: 6.8,
      status: "completed",
      rated: false,
      rating: null
    },
    {
      id: "TRP004",
      pickup: "Airport Terminal 2",
      destination: "Powai",
      date: "2025-07-30T14:20:00",
      fare: 680,
      distance: 18.5,
      status: "completed",
      rated: true,
      rating: 4
    }
  ];

  // Mock notifications data
  const mockNotifications = [
    {
      id: "NOT001",
      type: "success",
      title: "Trip Completed Successfully",
      message: "Your trip to Andheri East has been completed. Thank you for choosing CabBooker!",
      timestamp: "2025-08-02T07:45:00",
      actionLabel: "Rate Trip",
      actionUrl: "/trip-history"
    },
    {
      id: "NOT002",
      type: "promotion",
      title: "Weekend Special Offer",
      message: "Get 20% off on your next 3 bookings this weekend. Use code WEEKEND20",
      timestamp: "2025-08-02T06:00:00",
      actionLabel: "Book Now",
      actionUrl: "/trip-booking-form"
    },
    {
      id: "NOT003",
      type: "info",
      title: "New Package Tours Available",
      message: "Explore our new Mumbai sightseeing packages starting from ₹1,999",
      timestamp: "2025-08-01T20:30:00",
      actionLabel: "View Packages",
      actionUrl: "/package-tours-catalog"
    }
  ];

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('cabBookerUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // Load mock data for authenticated user
      setActiveTrip(mockActiveTrip);
      setRecentTrips(mockRecentTrips);
      setNotifications(mockNotifications);
    } else {
      // Redirect to landing page if not authenticated
      navigate('/landing-page');
    }

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [navigate]);

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cabBookerUser', JSON.stringify(userData));
    
    // Also store the token separately for API requests
    if (userData.token) {
      localStorage.setItem('auth_token', userData.token);
    }
    
    setShowAuthModal(false);
    // Load mock data after authentication
    setActiveTrip(mockActiveTrip);
    setRecentTrips(mockRecentTrips);
    setNotifications(mockNotifications);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTrip(null);
    setRecentTrips([]);
    setNotifications([]);
    navigate('/landing-page');
  };

  const handleContactDriver = () => {
    if (activeTrip?.driver?.phone) {
      window.open(`tel:${activeTrip?.driver?.phone}`, '_self');
    }
  };

  const handleTrackTrip = () => {
    if (activeTrip?.trackingUrl) {
      window.open(activeTrip?.trackingUrl, '_blank');
    }
  };

  const handleCancelTrip = () => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      setActiveTrip(null);
      // Add cancelled trip to recent trips
      const cancelledTrip = {
        ...activeTrip,
        status: 'cancelled',
        date: new Date()?.toISOString()
      };
      setRecentTrips(prev => [cancelledTrip, ...prev]);
    }
  };

  const handleRateTrip = (tripId) => {
    // Navigate to rating modal or inline rating
    console.log('Rating trip:', tripId);
    // Update trip as rated
    setRecentTrips(prev => 
      prev?.map(trip => 
        trip?.id === tripId 
          ? { ...trip, rated: true, rating: 5 }
          : trip
      )
    );
  };

  const handleViewTripDetails = () => {
    navigate('/trip-history');
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    
    const fields = ['name', 'phone', 'email', 'emergencyContact', 'address', 'dateOfBirth'];
    const completedFields = fields?.filter(field => user?.[field]);
    return Math.round((completedFields?.length / fields?.length) * 100);
  };

  const getLastBooking = () => {
    return recentTrips?.length > 0 ? recentTrips?.[0] : null;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onAuthRequired={handleAuthRequired}
        onLogout={handleLogout}
      />
      
      <TripStatusIndicator
        activeTrip={activeTrip}
        onViewDetails={handleViewTripDetails}
        onContactDriver={handleContactDriver}
      />

      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <WelcomeSection 
            user={user} 
            currentTime={currentTime} 
          />

          <ProfileCompletionPrompt 
            user={user}
            completionPercentage={calculateProfileCompletion()}
          />

          <CurrentTripCard
            activeTrip={activeTrip}
            onContactDriver={handleContactDriver}
            onTrackTrip={handleTrackTrip}
            onCancelTrip={handleCancelTrip}
          />

          <QuickActionCards 
            lastBooking={getLastBooking()}
          />

          <NotificationArea 
            notifications={notifications}
          />

          <RecentActivitySection
            recentTrips={recentTrips}
            onRateTrip={handleRateTrip}
          />
        </div>
      </main>

      <MobileBottomNavigation 
        user={user} 
        onAuthRequired={handleAuthRequired}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default UserDashboard;