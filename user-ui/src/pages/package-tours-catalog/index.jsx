import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import FilterPanel from './components/FilterPanel';
import PackageGrid from './components/PackageGrid';
import PackageBookingModal from './components/PackageBookingModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ApiService from '../../utils/api';

const PackageToursCatalog = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [packages, setPackages] = useState([]);
  const [allPackages, setAllPackages] = useState([]); // Store all loaded packages for filtering
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock packages data
  const mockPackages = [
    {
      id: 1,
      title: "Shimla Manali Adventure",
      location: "Himachal Pradesh",
      description: "Experience the beauty of hill stations with adventure activities and scenic landscapes.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      price: 15999,
      originalPrice: 18999,
      duration: 6,
      rating: 4.5,
      isPopular: true,
      discount: 15,
      highlights: ["Rohtang Pass", "Solang Valley", "Mall Road", "Adventure Sports"],
      amenities: ["meals", "accommodation", "transport", "guide"],
      type: "hill-station",
      priceRange: "mid"
    },
    {
      id: 2,
      title: "Goa Beach Paradise",
      location: "Goa",
      description: "Relax on pristine beaches with water sports, nightlife, and Portuguese heritage exploration.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop",
      price: 12999,
      originalPrice: 14999,
      duration: 4,
      rating: 4.3,
      isPopular: false,
      discount: 13,
      highlights: ["Baga Beach", "Water Sports", "Dudhsagar Falls", "Old Goa Churches"],
      amenities: ["meals", "accommodation", "transport"],
      type: "beach",
      priceRange: "mid"
    },
    {
      id: 3,
      title: "Rajasthan Royal Heritage",
      location: "Rajasthan",
      description: "Discover the royal heritage of Rajasthan with magnificent palaces, forts, and desert safari.",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=300&fit=crop",
      price: 22999,
      originalPrice: 26999,
      duration: 8,
      rating: 4.7,
      isPopular: true,
      discount: 15,
      highlights: ["Amber Fort", "City Palace", "Desert Safari", "Hawa Mahal"],
      amenities: ["meals", "accommodation", "transport", "guide", "activities"],
      type: "heritage",
      priceRange: "premium"
    },
    {
      id: 4,
      title: "Kerala Backwaters Bliss",
      location: "Kerala",
      description: "Cruise through serene backwaters, explore spice plantations, and enjoy Ayurvedic treatments.",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=300&fit=crop",
      price: 18999,
      originalPrice: 21999,
      duration: 5,
      rating: 4.6,
      isPopular: false,
      discount: 14,
      highlights: ["Houseboat Stay", "Spice Gardens", "Ayurveda", "Kathakali Show"],
      amenities: ["meals", "accommodation", "transport", "guide"],
      type: "beach",
      priceRange: "mid"
    },
    {
      id: 5,
      title: "Ladakh Adventure Expedition",
      location: "Ladakh",
      description: "High-altitude adventure with stunning landscapes, monasteries, and thrilling bike rides.",
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=500&h=300&fit=crop",
      price: 28999,
      originalPrice: 32999,
      duration: 10,
      rating: 4.8,
      isPopular: true,
      discount: 12,
      highlights: ["Pangong Lake", "Nubra Valley", "Monasteries", "Bike Expedition"],
      amenities: ["meals", "accommodation", "transport", "guide", "activities"],
      type: "adventure",
      priceRange: "premium"
    },
    {
      id: 6,
      title: "Darjeeling Tea Gardens",
      location: "West Bengal",
      description: "Explore tea gardens, enjoy toy train rides, and witness stunning Himalayan sunrise views.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop",
      price: 9999,
      originalPrice: 11999,
      duration: 3,
      rating: 4.2,
      isPopular: false,
      discount: 17,
      highlights: ["Tiger Hill", "Tea Gardens", "Toy Train", "Himalayan Views"],
      amenities: ["meals", "accommodation", "transport"],
      type: "hill-station",
      priceRange: "budget"
    },
    {
      id: 7,
      title: "Andaman Island Escape",
      location: "Andaman & Nicobar",
      description: "Pristine beaches, coral reefs, water sports, and historical cellular jail exploration.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
      price: 24999,
      originalPrice: 28999,
      duration: 7,
      rating: 4.4,
      isPopular: false,
      discount: 14,
      highlights: ["Radhanagar Beach", "Scuba Diving", "Cellular Jail", "Ross Island"],
      amenities: ["meals", "accommodation", "transport", "activities"],
      type: "beach",
      priceRange: "premium"
    },
    {
      id: 8,
      title: "Rishikesh Yoga Retreat",
      location: "Uttarakhand",
      description: "Spiritual journey with yoga sessions, meditation, river rafting, and temple visits.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop",
      price: 8999,
      originalPrice: 10999,
      duration: 4,
      rating: 4.3,
      isPopular: false,
      discount: 18,
      highlights: ["Yoga Sessions", "River Rafting", "Ganga Aarti", "Beatles Ashram"],
      amenities: ["meals", "accommodation", "guide", "activities"],
      type: "spiritual",
      priceRange: "budget"
    }
  ];

  // Mock search suggestions
  const mockSuggestions = [
    { name: "Shimla", type: "Hill Station" },
    { name: "Goa", type: "Beach Destination" },
    { name: "Rajasthan", type: "Heritage" },
    { name: "Kerala", type: "Backwaters" },
    { name: "Ladakh", type: "Adventure" },
    { name: "Darjeeling", type: "Hill Station" },
    { name: "Andaman", type: "Island" },
    { name: "Rishikesh", type: "Spiritual" }
  ];

  useEffect(() => {
    // Check for saved user
    const savedUser = localStorage.getItem('cabBookerUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load initial packages
    loadPackages();
  }, []);

  useEffect(() => {
    // Filter and sort packages when dependencies change
    filterAndSortPackages();
  }, [searchQuery, sortBy, filters, allPackages]);

  const loadPackages = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading packages from API...');
      const response = await ApiService.getAvailablePackages();
      console.log('📦 API Response:', response);
      
      if (response.success && response.data) {
        // Transform DB data to match the frontend format
        const transformedPackages = response.data.map(pkg => ({
          id: pkg.id,
          title: pkg.title,
          location: pkg.location,
          description: pkg.description,
          image: pkg.image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
          price: pkg.price,
          originalPrice: Math.floor(pkg.price * 1.15), // Add 15% as original price for discount display
          duration: pkg.duration_days,
          rating: 4.5, // Default rating since not in DB
          isPopular: Math.random() > 0.5, // Random popularity
          discount: Math.floor(((Math.floor(pkg.price * 1.15) - pkg.price) / Math.floor(pkg.price * 1.15)) * 100),
          highlights: pkg.segments?.map(seg => seg.location_name).filter(Boolean) || pkg.tags || [],
          amenities: ["meals", "accommodation", "transport"], // Default amenities
          type: pkg.vehicle_type || "adventure",
          priceRange: pkg.price < 15000 ? "budget" : pkg.price < 25000 ? "mid" : "premium",
          vehicle_type: pkg.vehicle_type,
          tags: pkg.tags,
          segments: pkg.segments
        }));
        
        console.log('✅ Transformed packages:', transformedPackages);
        setAllPackages(transformedPackages);
        setPackages(transformedPackages);
      } else {
        throw new Error(response.error || 'Failed to load packages');
      }
    } catch (error) {
      console.error('❌ Error loading packages:', error);
      // Fallback to mock data on error
      setAllPackages(mockPackages);
      setPackages(mockPackages);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPackages = () => {
    let filtered = [...allPackages];

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(pkg => 
        pkg?.title?.toLowerCase()?.includes(query) ||
        pkg?.location?.toLowerCase()?.includes(query) ||
        pkg?.description?.toLowerCase()?.includes(query) ||
        pkg?.highlights?.some(h => h?.toLowerCase()?.includes(query))
      );
    }

    // Apply filters
    Object.entries(filters)?.forEach(([key, values]) => {
      if (values && values?.length > 0) {
        switch (key) {
          case 'duration':
            filtered = filtered?.filter(pkg => {
              return values?.some(value => {
                if (value === '1-3') return pkg?.duration >= 1 && pkg?.duration <= 3;
                if (value === '4-7') return pkg?.duration >= 4 && pkg?.duration <= 7;
                if (value === '8+') return pkg?.duration >= 8;
                return false;
              });
            });
            break;
          case 'priceRange':
            filtered = filtered?.filter(pkg => values?.includes(pkg?.priceRange));
            break;
          case 'type':
            filtered = filtered?.filter(pkg => values?.includes(pkg?.type));
            break;
          case 'amenities':
            filtered = filtered?.filter(pkg => 
              values?.some(amenity => pkg?.amenities?.includes(amenity))
            );
            break;
          case 'rating':
            filtered = filtered?.filter(pkg => {
              return values?.some(value => {
                const minRating = parseFloat(value?.replace('+', ''));
                return pkg?.rating >= minRating;
              });
            });
            break;
        }
      }
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'duration':
        filtered?.sort((a, b) => a?.duration - b?.duration);
        break;
      case 'popularity':
        filtered?.sort((a, b) => {
          if (a?.isPopular && !b?.isPopular) return -1;
          if (!a?.isPopular && b?.isPopular) return 1;
          return b?.rating - a?.rating;
        });
        break;
      default: // relevance
        filtered?.sort((a, b) => {
          if (a?.isPopular && !b?.isPopular) return -1;
          if (!a?.isPopular && b?.isPopular) return 1;
          return b?.rating - a?.rating;
        });
    }

    setPackages(filtered);
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cabBookerUser', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion?.name);
  };

  const handleBookPackage = (pkg) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Show package preview modal instead of direct navigation
    setSelectedPackage(pkg);
    setShowPackageModal(true);
  };

  const handlePackageBookingConfirm = (pkg) => {
    // Navigate to booking form with package pre-filled
    // Transform the package data back to the format expected by the booking form
    const packageData = {
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      location: pkg.location,
      duration_days: pkg.duration,
      price: pkg.price,
      vehicle_type: pkg.vehicle_type,
      tags: pkg.tags,
      segments: pkg.segments
    };
    
    navigate('/trip-booking-form', { 
      state: { 
        packageData: packageData,
        tripType: 'package'
      } 
    });
  };

  const handleLoadMore = async () => {
    // Simulate loading more packages
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentPage(prev => prev + 1);
    
    // For demo, stop loading more after page 3
    if (currentPage >= 2) {
      setHasMore(false);
    }
  };

  const getFilteredSuggestions = () => {
    if (!searchQuery?.trim()) return [];
    
    return mockSuggestions?.filter(suggestion =>
      suggestion?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      suggestion?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )?.slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onAuthRequired={handleAuthRequired}
      />
      <main className="pt-4 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <span>Home</span>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground">Package Tours</span>
            </div>
            <h1 className="fluid-text-3xl font-bold text-foreground mb-2">
              Discover Amazing Packages
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our curated collection of travel packages designed to give you the perfect getaway experience.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              suggestions={getFilteredSuggestions()}
              onSuggestionSelect={handleSuggestionSelect}
            />

            {/* Filter Chips and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <FilterChips
                activeFilters={filters}
                onFilterChange={setFilters}
                onShowFilters={() => setShowFilterPanel(true)}
                className="flex-1"
              />
              
              <SortDropdown
                sortBy={sortBy}
                onSortChange={setSortBy}
                className="sm:ml-4"
              />
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {packages?.length} package{packages?.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              
              {Object.keys(filters)?.some(key => filters?.[key]?.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({})}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Package Grid */}
          <PackageGrid
            packages={packages}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onBookPackage={handleBookPackage}
          />
        </div>
      </main>
      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Package Booking Modal */}
      <PackageBookingModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        package={selectedPackage}
        onBookNow={handlePackageBookingConfirm}
      />

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

export default PackageToursCatalog;