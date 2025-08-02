import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import TripStatusIndicator from '../../components/ui/TripStatusIndicator';
import AuthModal from '../../components/ui/AuthModal';
import ProfileHeader from './components/ProfileHeader';
import PersonalInformation from './components/PersonalInformation';
import TravelPreferences from './components/TravelPreferences';
import AccountSecurity from './components/AccountSecurity';
import PaymentMethods from './components/PaymentMethods';
import BookingPreferences from './components/BookingPreferences';
import AppSettings from './components/AppSettings';
import LogoutSection from './components/LogoutSection';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    emergencyContact: "+91 98765 43211",
    dateOfBirth: "1990-05-15",
    gender: "male",
    totalTrips: 127,
    rating: 4.8,
    membershipStatus: "premium"
  };

  const mockTravelPreferences = {
    defaultPickupLocation: "Bandra West, Mumbai, Maharashtra",
    preferredVehicleTypes: ["economy", "premium"],
    notifications: {
      sms: true,
      email: true,
      push: true,
      promotional: false
    },
    accessibility: {
      wheelchairAccessible: false,
      childSeat: false,
      petFriendly: true
    }
  };

  const mockSecuritySettings = {
    twoFactorEnabled: true,
    lastPasswordChange: "2024-05-15",
    activeSessions: 3
  };

  const mockPaymentMethods = {
    cards: [
      { id: 1, type: 'visa', lastFour: '4532', isDefault: true },
      { id: 2, type: 'mastercard', lastFour: '8901', isDefault: false }
    ],
    wallets: [
      { id: 'paytm', connected: true },
      { id: 'googlepay', connected: true }
    ]
  };

  const mockBookingPreferences = {
    favoriteRoutes: [],
    frequentDestinations: [],
    defaultPassengerCount: 1,
    preferredBookingTime: "immediate",
    autoBookingEnabled: false
  };

  const mockAppSettings = {
    theme: "dark",
    language: "en",
    notifications: {
      push: true,
      email: true,
      sms: false,
      marketing: false
    },
    privacy: {
      shareLocation: true,
      shareTrips: false,
      analytics: true
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reduceMotion: false
    }
  };

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user is logged in (mock check)
        const isLoggedIn = localStorage.getItem('cabBookerUser');
        if (isLoggedIn) {
          setUser(mockUser);
        } else {
          setShowAuthModal(true);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cabBookerUser', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handlePersonalInfoSave = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    // In real app, this would make an API call
    console.log('Personal info saved:', data);
  };

  const handleTravelPreferencesSave = (data) => {
    // In real app, this would make an API call
    console.log('Travel preferences saved:', data);
  };

  const handleSecuritySave = (data) => {
    // In real app, this would make an API call
    console.log('Security settings saved:', data);
  };

  const handlePaymentMethodsSave = (data) => {
    // In real app, this would make an API call
    console.log('Payment methods updated:', data);
  };

  const handleBookingPreferencesSave = (data) => {
    // In real app, this would make an API call
    console.log('Booking preferences saved:', data);
  };

  const handleAppSettingsSave = (data) => {
    // In real app, this would make an API call
    console.log('App settings saved:', data);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cabBookerUser');
    navigate('/landing-page');
  };

  const handleViewTripDetails = () => {
    navigate('/trip-history');
  };

  const handleContactDriver = () => {
    // In real app, this would open contact modal or make a call
    console.log('Contact driver');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user && !showAuthModal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onAuthRequired={handleAuthRequired}
      />
      
      <TripStatusIndicator
        activeTrip={activeTrip}
        onViewDetails={handleViewTripDetails}
        onContactDriver={handleContactDriver}
      />

      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <ProfileHeader 
            user={user}
            membershipStatus={user?.membershipStatus || 'regular'}
          />

          {/* Personal Information */}
          <PersonalInformation 
            user={user}
            onSave={handlePersonalInfoSave}
          />

          {/* Travel Preferences */}
          <TravelPreferences 
            preferences={mockTravelPreferences}
            onSave={handleTravelPreferencesSave}
          />

          {/* Account Security */}
          <AccountSecurity 
            securitySettings={mockSecuritySettings}
            onSave={handleSecuritySave}
          />

          {/* Payment Methods */}
          <PaymentMethods 
            paymentMethods={mockPaymentMethods}
            onSave={handlePaymentMethodsSave}
          />

          {/* Booking Preferences */}
          <BookingPreferences 
            preferences={mockBookingPreferences}
            onSave={handleBookingPreferencesSave}
          />

          {/* App Settings */}
          <AppSettings 
            settings={mockAppSettings}
            onSave={handleAppSettingsSave}
          />

          {/* Logout Section */}
          <LogoutSection 
            onLogout={handleLogout}
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

export default UserProfile;