import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const TermsOfService = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const termsSection = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using CabBooker's services, you accept and agree to be bound by the terms and provision of this agreement.",
        "These Terms of Service apply to all users of the service, including without limitation users who are browsers, drivers, vendors, customers, merchants, and contributors of content.",
        "If you do not agree to abide by the above, please do not use this service."
      ]
    },
    {
      title: "2. Use of Services",
      content: [
        "You must be at least 18 years old to use our services. By using our platform, you warrant that you are at least 18 years of age.",
        "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.",
        "You agree to accept responsibility for all activities that occur under your account or password.",
        "You may not use our service for any illegal or unauthorized purpose nor may you, in the use of the service, violate any laws in your jurisdiction."
      ]
    },
    {
      title: "3. Booking and Payment",
      content: [
        "All bookings are subject to availability and confirmation of the booking details.",
        "Payment for services must be made through the payment methods available on our platform.",
        "Prices are subject to change without notice. The price applicable to your booking will be the price quoted at the time of booking confirmation.",
        "We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion."
      ]
    },
    {
      title: "4. Cancellation and Refunds",
      content: [
        "Cancellation policies may vary depending on the type of service booked. Please refer to the specific cancellation policy for your booking.",
        "Refunds, if applicable, will be processed within 5-7 business days to the original payment method.",
        "No-show bookings may be charged the full booking amount and are generally non-refundable.",
        "We reserve the right to cancel any booking due to unforeseen circumstances, with full refund to the customer."
      ]
    },
    {
      title: "5. Driver and Vehicle Standards",
      content: [
        "All drivers undergo background verification and must maintain valid licenses and permits.",
        "Vehicles are regularly inspected and maintained according to safety standards.",
        "We are not responsible for any personal items left in vehicles, though we will assist in recovery efforts.",
        "Passengers must treat drivers and vehicles with respect. Inappropriate behavior may result in account termination."
      ]
    },
    {
      title: "6. Limitation of Liability",
      content: [
        "CabBooker acts as a technology platform connecting passengers with transportation providers.",
        "We are not liable for any damages, injuries, or losses that may occur during the transportation service.",
        "Our liability is limited to the amount paid for the specific booking in question.",
        "We do not guarantee the quality, suitability, safety, or ability of third-party providers."
      ]
    },
    {
      title: "7. Privacy and Data Protection",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.",
        "We implement appropriate security measures to protect your personal information.",
        "We may share your information with drivers and other service providers as necessary to provide our services.",
        "You have the right to access, update, or delete your personal information as per applicable laws."
      ]
    },
    {
      title: "8. Modifications to Terms",
      content: [
        "We reserve the right to modify these terms at any time without prior notice.",
        "Updated terms will be posted on our website and app, and continued use of our services constitutes acceptance of the modified terms.",
        "It is your responsibility to check these terms periodically for changes.",
        "If you disagree with any changes to these terms, you must discontinue use of our services."
      ]
    },
    {
      title: "9. Governing Law",
      content: [
        "These Terms of Service shall be interpreted and governed by the laws of India.",
        "Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.",
        "If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect."
      ]
    },
    {
      title: "10. Contact Information",
      content: [
        "If you have any questions about these Terms of Service, please contact us at:",
        "Email: support@cabbooker.com",
        "Phone: +91 98765 43210",
        "Address: 123 Tech Park, Bangalore, India - 560001"
      ]
    }
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
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h1 className="fluid-text-4xl font-bold text-foreground mb-6">
                Terms of Service
              </h1>
              <p className="fluid-text-lg text-muted-foreground">
                Please read these terms and conditions carefully before using our service
              </p>
              <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-muted-foreground">
                <Icon name="Calendar" size={16} />
                <span>Last updated: January 1, 2024</span>
              </div>
            </div>

            {/* Terms Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* Introduction */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={24} className="text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Important Notice</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      These Terms of Service ("Terms") govern your use of CabBooker's transportation booking platform. 
                      By using our services, you agree to these terms in their entirety.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Sections */}
              {termsSection.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Questions About Our Terms?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    If you have any questions about these Terms of Service, please don't hesitate to contact us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href="/contact-us"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <Icon name="MessageCircle" size={20} />
                      <span>Contact Support</span>
                    </motion.a>
                    <motion.a
                      href="mailto:support@cabbooker.com"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 bg-card text-card-foreground border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted/50 transition-colors"
                    >
                      <Icon name="Mail" size={20} />
                      <span>Email Us</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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

export default TermsOfService;