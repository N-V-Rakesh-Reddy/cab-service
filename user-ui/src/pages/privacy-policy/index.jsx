import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const PrivacyPolicy = () => {
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

  const privacySections = [
    {
      title: "1. Information We Collect",
      content: [
        "Personal Information: We collect information you provide directly to us, such as when you create an account, make a booking, or contact us. This includes your name, email address, phone number, and payment information.",
        "Location Information: We collect precise location data when you use our mobile app to help connect you with nearby drivers and provide navigation services.",
        "Usage Information: We collect information about how you use our services, including booking history, preferences, and interaction with our app and website.",
        "Device Information: We may collect information about your mobile device, including hardware model, operating system, and unique device identifiers."
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "Service Provision: To provide, maintain, and improve our transportation booking services.",
        "Communication: To communicate with you about your bookings, send confirmations, updates, and customer support messages.",
        "Safety and Security: To ensure the safety and security of our platform, verify driver and passenger identities, and prevent fraud.",
        "Personalization: To personalize your experience and provide recommendations based on your preferences and usage patterns.",
        "Legal Compliance: To comply with applicable laws, regulations, and legal processes."
      ]
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: [
        "Service Providers: We share information with drivers and other service providers necessary to complete your bookings.",
        "Business Partners: We may share information with trusted business partners who help us provide and improve our services.",
        "Legal Requirements: We may disclose information if required by law or in response to valid requests by public authorities.",
        "Business Transfers: Information may be transferred in connection with a merger, acquisition, or sale of all or a portion of our business.",
        "We do not sell, trade, or rent your personal information to third parties for marketing purposes."
      ]
    },
    {
      title: "4. Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        "Payment information is processed through secure payment gateways and we do not store complete payment card details on our servers.",
        "We use encryption technologies to protect sensitive data in transit and at rest.",
        "Despite our efforts, no security measures are perfect, and we cannot guarantee absolute security of your information."
      ]
    },
    {
      title: "5. Data Retention",
      content: [
        "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy.",
        "Account information is retained for the duration of your account and for a reasonable period after account closure for legal and business purposes.",
        "Trip history and related data may be retained for up to 7 years for legal compliance and dispute resolution purposes.",
        "You may request deletion of your personal information, subject to legal and contractual restrictions."
      ]
    },
    {
      title: "6. Your Rights and Choices",
      content: [
        "Access and Update: You can access and update your personal information through your account settings.",
        "Data Portability: You may request a copy of your personal information in a portable format.",
        "Deletion: You may request deletion of your personal information, subject to legal and operational requirements.",
        "Marketing Communications: You can opt out of promotional emails by following the unsubscribe instructions in the emails.",
        "Location Services: You can disable location tracking through your device settings, though this may limit service functionality."
      ]
    },
    {
      title: "7. Cookies and Similar Technologies",
      content: [
        "We use cookies and similar tracking technologies to collect information about your browsing activities and to personalize your experience.",
        "Essential cookies are necessary for the basic functionality of our services and cannot be disabled.",
        "Analytics cookies help us understand how users interact with our platform to improve our services.",
        "You can manage cookie preferences through your browser settings, but disabling certain cookies may affect functionality."
      ]
    },
    {
      title: "8. Children's Privacy",
      content: [
        "Our services are not intended for children under the age of 18, and we do not knowingly collect personal information from children.",
        "If we become aware that we have collected personal information from a child, we will take steps to delete such information promptly.",
        "Parents or guardians who believe their child has provided personal information should contact us immediately."
      ]
    },
    {
      title: "9. International Data Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your country of residence.",
        "We ensure appropriate safeguards are in place to protect your information when it is transferred internationally.",
        "By using our services, you consent to the transfer of your information to countries that may have different data protection laws."
      ]
    },
    {
      title: "10. Changes to This Privacy Policy",
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.",
        "We will notify you of material changes by posting the updated policy on our website and app.",
        "Your continued use of our services after the effective date of the updated policy constitutes acceptance of the changes.",
        "We encourage you to review this policy periodically to stay informed about how we protect your information."
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
                Privacy Policy
              </h1>
              <p className="fluid-text-lg text-muted-foreground">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-muted-foreground">
                <Icon name="Calendar" size={16} />
                <span>Last updated: January 1, 2024</span>
              </div>
            </div>

            {/* Privacy Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* Introduction */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Shield" size={24} className="text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Our Commitment to Privacy</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      CabBooker ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                      how we collect, use, disclose, and safeguard your information when you use our transportation booking platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Sections */}
              {privacySections.map((section, index) => (
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

              {/* Data Rights Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-foreground mb-4">Your Data Rights Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: 'Eye', title: 'Right to Access', desc: 'View your personal data' },
                    { icon: 'Edit', title: 'Right to Update', desc: 'Correct inaccurate information' },
                    { icon: 'Download', title: 'Right to Export', desc: 'Download your data' },
                    { icon: 'Trash', title: 'Right to Delete', desc: 'Request data deletion' }
                  ].map((right) => (
                    <div key={right.title} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Icon name={right.icon} size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{right.title}</p>
                        <p className="text-sm text-muted-foreground">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Questions About Your Privacy?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us.
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
                      href="mailto:privacy@cabbooker.com"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 bg-card text-card-foreground border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted/50 transition-colors"
                    >
                      <Icon name="Mail" size={20} />
                      <span>Email Privacy Team</span>
                    </motion.a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Data Protection Officer:</strong> privacy@cabbooker.com<br />
                      <strong>Address:</strong> 123 Tech Park, Bangalore, India - 560001
                    </p>
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

export default PrivacyPolicy;