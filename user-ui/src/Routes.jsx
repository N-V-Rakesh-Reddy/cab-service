import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import TripHistory from './pages/trip-history';
import PackageToursCatalog from './pages/package-tours-catalog';
import LandingPage from './pages/landing-page';
import UserDashboard from './pages/user-dashboard';
import TripBookingForm from './pages/trip-booking-form';
import UserProfile from './pages/user-profile';
import AboutUs from './pages/about-us';
import OurFleet from './pages/our-fleet';
import HelpCenter from './pages/help-center';
import ContactUs from './pages/contact-us';
import TermsOfService from './pages/terms-of-service';
import PrivacyPolicy from './pages/privacy-policy';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/trip-history" element={<TripHistory />} />
        <Route path="/package-tours-catalog" element={<PackageToursCatalog />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/trip-booking-form" element={<TripBookingForm />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-fleet" element={<OurFleet />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
