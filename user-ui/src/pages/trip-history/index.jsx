import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApiService from '../../utils/api';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import TripStatusIndicator from '../../components/ui/TripStatusIndicator';
import AuthModal from '../../components/ui/AuthModal';
import TabNavigation from './components/TabNavigation';
import SearchBar from './components/SearchBar';
import TripCard from './components/TripCard';
import EmptyState from './components/EmptyState';
import LoadingSkeleton from './components/LoadingSkeleton';
import TripModal from './components/TripModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const TripHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'details',
    trip: null
  });

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('cabBookerUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch trips from API
  const fetchTrips = async (refresh = false) => {
    if (!user) return;

    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const bookings = await ApiService.getUserBookingHistory({ limit: 50 });
      
      // Transform API data to match frontend structure
      const transformedTrips = bookings.map(booking => ({
        id: booking.id,
        bookingId: booking.id.slice(0, 12).toUpperCase(),
        from: booking.trip_segments?.find(s => s.type === 'pickup')?.location_name || 'Unknown',
        to: booking.trip_segments?.find(s => s.type === 'drop')?.location_name || 'Unknown',
        date: booking.scheduled_at,
        type: booking.booking_type?.replace('_', '-'), // Convert back to frontend format
        vehicleType: booking.vehicle_type || 'Sedan',
        fare: booking.total_price || 0,
        status: booking.status,
        duration: booking.estimated_duration ? `${Math.round(booking.estimated_duration / 60)} hr ${booking.estimated_duration % 60} min` : 'N/A',
        distance: booking.estimated_distance ? `${booking.estimated_distance} km` : 'N/A',
        paymentMethod: booking.payment_method || (booking.payment_status === 'paid' ? 'Online' : 'Pending'),
        category: getCategoryFromStatus(booking.status),
        stops: booking.trip_segments?.filter(s => s.type === 'intermediate').map(s => s.location_name) || [],
        rated: false,
        driver: booking.driver_id ? {
          name: 'Driver Name', // This would be populated from joined driver data
          phone: '+91 98765 xxxxx',
          vehicle: 'Vehicle Details', // This would come from driver.vehicle_model + driver.vehicle_number
          rating: 4.5
        } : null
      }));

      setTrips(transformedTrips);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setError(err.message || 'Failed to load trip history');
      // Fallback to empty array
      setTrips([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Helper function to categorize trips
  const getCategoryFromStatus = (status) => {
    switch (status) {
      case 'ongoing':
        return 'current';
      case 'pending':
      case 'confirmed':
        return 'upcoming';
      case 'completed':
      case 'cancelled':
        return 'completed';
      default:
        return 'completed';
    }
  };

  // Load trips when user is available
  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  // Mock trips data
  const mockTrips = [
    {
      id: 1,
      bookingId: "CB2025080201",
      from: "Connaught Place",
      to: "IGI Airport Terminal 3",
      date: "2025-08-02T10:30:00",
      type: "airport",
      vehicleType: "Sedan",
      fare: 850,
      status: "ongoing",
      duration: "45 min",
      distance: "28 km",
      paymentMethod: "UPI",
      category: "current",
      driver: {
        name: "Suresh Singh",
        phone: "+91 98765 12345",
        vehicle: "Honda City - DL 8C 1234",
        rating: 4.8
      },
      stops: [],
      rated: false
    },
    {
      id: 2,
      bookingId: "CB2025080301",
      from: "Gurgaon Cyber City",
      to: "Delhi Railway Station",
      date: "2025-08-03T14:00:00",
      type: "one-way",
      vehicleType: "Hatchback",
      fare: 650,
      status: "confirmed",
      duration: "55 min",
      distance: "32 km",
      paymentMethod: "Cash",
      category: "upcoming",
      driver: {
        name: "Amit Sharma",
        phone: "+91 98765 67890",
        vehicle: "Maruti Swift - HR 26 5678",
        rating: 4.6
      },
      stops: ["Gurgaon Mall", "IFFCO Chowk"],
      rated: false
    },
    {
      id: 3,
      bookingId: "CB2025080401",
      from: "Karol Bagh",
      to: "India Gate",
      date: "2025-08-04T09:15:00",
      type: "local",
      vehicleType: "Auto",
      fare: 180,
      status: "scheduled",
      duration: "25 min",
      distance: "8 km",
      paymentMethod: "Digital Wallet",
      category: "upcoming",
      driver: null,
      stops: [],
      rated: false
    },
    {
      id: 4,
      bookingId: "CB2025073101",
      from: "Noida Sector 62",
      to: "Ghaziabad Railway Station",
      date: "2025-07-31T16:45:00",
      type: "one-way",
      vehicleType: "SUV",
      fare: 750,
      status: "completed",
      duration: "40 min",
      distance: "22 km",
      paymentMethod: "Credit Card",
      category: "past",
      driver: {
        name: "Vikram Singh",
        phone: "+91 98765 11111",
        vehicle: "Mahindra XUV300 - UP 16 9876",
        rating: 4.9
      },
      stops: [],
      rated: true,
      rating: 5
    },
    {
      id: 5,
      bookingId: "CB2025073001",
      from: "Dwarka Sector 21",
      to: "Chandni Chowk",
      date: "2025-07-30T11:20:00",
      type: "round-trip",
      vehicleType: "Sedan",
      fare: 1200,
      status: "completed",
      duration: "2 hr 15 min",
      distance: "45 km",
      paymentMethod: "UPI",
      category: "past",
      driver: {
        name: "Ravi Kumar",
        phone: "+91 98765 22222",
        vehicle: "Hyundai Verna - DL 3C 4567",
        rating: 4.7
      },
      stops: ["Red Fort", "Jama Masjid"],
      rated: false
    },
    {
      id: 6,
      bookingId: "CB2025072901",
      from: "Lajpat Nagar",
      to: "Saket Metro Station",
      date: "2025-07-29T08:30:00",
      type: "one-way",
      vehicleType: "Hatchback",
      fare: 320,
      status: "cancelled",
      duration: "20 min",
      distance: "12 km",
      paymentMethod: "Cash",
      category: "past",
      driver: null,
      stops: [],
      rated: false
    }
  ];

  // Filter trips based on active tab and search query
  const filteredTrips = trips?.filter(trip => {
    const matchesTab = trip?.category === activeTab;
    const matchesSearch = searchQuery === '' || 
      trip?.from?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      trip?.to?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      trip?.bookingId?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Get trip counts for tabs
  const tripCounts = {
    current: trips?.filter(trip => trip?.category === 'current')?.length || 0,
    upcoming: trips?.filter(trip => trip?.category === 'upcoming')?.length || 0,
    completed: trips?.filter(trip => trip?.category === 'completed')?.length || 0
  };

  // Get active trip for status indicator
  const activeTrip = trips?.find(trip => trip?.status === 'ongoing');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setTrips([]);
    navigate('/landing-page');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleRefresh = async () => {
    if (user) {
      await fetchTrips(true);
    }
  };

  const handleTrackTrip = (trip) => {
    console.log('Track trip:', trip?.id);
    // Navigate to tracking page or show tracking modal
  };

  const handleCancelTrip = (trip) => {
    setModalState({
      isOpen: true,
      type: 'cancel',
      trip
    });
  };

  const handleModifyTrip = (trip) => {
    console.log('Modify trip:', trip?.id);
    navigate('/trip-booking-form', { state: { editTrip: trip } });
  };

  const handleRateTrip = (trip) => {
    setModalState({
      isOpen: true,
      type: 'rate',
      trip
    });
  };

  const handleBookAgain = (trip) => {
    console.log('Book again:', trip?.id);
    navigate('/trip-booking-form', { state: { repeatTrip: trip } });
  };

  const handleViewTripDetails = (trip) => {
    setModalState({
      isOpen: true,
      type: 'details',
      trip
    });
  };

  const handleModalConfirm = (data) => {
    console.log('Modal confirmed:', data);
    // Handle the confirmation based on modal type
  };

  const handleBookNewTrip = () => {
    navigate('/trip-booking-form');
  };

  const handleContactDriver = () => {
    console.log('Contact driver');
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAuthRequired={handleAuthRequired} />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Login Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please login to view your trip history
            </p>
            <Button
              variant="default"
              onClick={handleAuthRequired}
              iconName="LogIn"
              iconPosition="left"
            >
              Login Now
            </Button>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
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
      {/* Trip Status Indicator */}
      <TripStatusIndicator
        activeTrip={activeTrip}
        onViewDetails={() => handleViewTripDetails(activeTrip)}
        onContactDriver={handleContactDriver}
      />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="fluid-text-2xl font-bold text-foreground mb-2">
            Trip History
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your bookings
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          className="mb-6"
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tripCounts={tripCounts}
          className="mb-6"
        />

        {/* Trip List */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSkeleton key="loading" count={3} />
          ) : filteredTrips?.length === 0 ? (
            <EmptyState
              key="empty"
              type={searchQuery ? 'search' : activeTab}
              onAction={searchQuery ? handleClearSearch : handleBookNewTrip}
            />
          ) : (
            <motion.div
              key="trips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredTrips?.map((trip) => (
                <TripCard
                  key={trip?.id}
                  trip={trip}
                  onTrack={handleTrackTrip}
                  onCancel={handleCancelTrip}
                  onModify={handleModifyTrip}
                  onRate={handleRateTrip}
                  onBookAgain={handleBookAgain}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pull to Refresh Indicator */}
        {isRefreshing && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-200 glass-morphism bg-card/90 rounded-lg px-4 py-2 border border-border">
            <div className="flex items-center space-x-2 text-sm text-card-foreground">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} />
              </div>
              <span>Refreshing trips...</span>
            </div>
          </div>
        )}
      </main>
      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation 
        user={user}
        onAuthRequired={handleAuthRequired}
      />
      {/* Trip Modal */}
      <TripModal
        isOpen={modalState?.isOpen}
        onClose={() => setModalState({ isOpen: false, type: 'details', trip: null })}
        trip={modalState?.trip}
        type={modalState?.type}
        onConfirm={handleModalConfirm}
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

export default TripHistory;