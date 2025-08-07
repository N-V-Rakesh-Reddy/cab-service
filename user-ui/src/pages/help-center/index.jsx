import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const HelpCenter = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

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

  const categories = [
    { id: 'all', name: 'All Topics', icon: 'HelpCircle' },
    { id: 'booking', name: 'Booking', icon: 'Calendar' },
    { id: 'payment', name: 'Payment', icon: 'CreditCard' },
    { id: 'cancellation', name: 'Cancellation', icon: 'X' },
    { id: 'safety', name: 'Safety', icon: 'Shield' },
    { id: 'account', name: 'Account', icon: 'User' }
  ];

  const faqs = [
    // Booking
    {
      id: 1,
      category: 'booking',
      question: 'How do I book a cab?',
      answer: 'You can book a cab through our website or mobile app. Simply enter your pickup and drop locations, select your preferred vehicle type, choose the date and time, and confirm your booking. You\'ll receive a confirmation with driver details.'
    },
    {
      id: 2,
      category: 'booking',
      question: 'Can I book a cab in advance?',
      answer: 'Yes, you can book a cab up to 30 days in advance. This is perfect for airport transfers, important meetings, or planned trips. Just select your preferred date and time during booking.'
    },
    {
      id: 3,
      category: 'booking',
      question: 'What if no drivers are available?',
      answer: 'If no drivers are immediately available, we\'ll notify you and suggest alternative pickup times. You can also join our waitlist, and we\'ll alert you when a driver becomes available.'
    },
    
    // Payment
    {
      id: 4,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, digital wallets (Paytm, PhonePe, Google Pay), and cash payments. Choose your preferred method during booking.'
    },
    {
      id: 5,
      category: 'payment',
      question: 'When will I be charged?',
      answer: 'For advance bookings, payment is processed immediately after confirmation. For instant bookings, you can choose to pay online during booking or pay cash to the driver at the end of your trip.'
    },
    {
      id: 6,
      category: 'payment',
      question: 'Do you provide invoices?',
      answer: 'Yes, we provide detailed invoices for all rides. You can download invoices from your trip history section in the app or website. Corporate customers can also request GST invoices.'
    },
    
    // Cancellation
    {
      id: 7,
      category: 'cancellation',
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking. Free cancellation is available up to 1 hour before pickup time. Cancellations within 1 hour may incur a small fee. No charges apply if the driver cancels.'
    },
    {
      id: 8,
      category: 'cancellation',
      question: 'How do I get a refund?',
      answer: 'Refunds for eligible cancellations are processed automatically within 5-7 business days to your original payment method. For cash payments, refunds are credited to your CabBooker wallet.'
    },
    
    // Safety
    {
      id: 9,
      category: 'safety',
      question: 'How do you ensure passenger safety?',
      answer: 'We verify all drivers with background checks, provide real-time GPS tracking, have an in-app emergency button, share trip details with your contacts, and maintain 24/7 customer support for any safety concerns.'
    },
    {
      id: 10,
      category: 'safety',
      question: 'Can I share my trip details?',
      answer: 'Yes, you can share your live trip details with family or friends. The app allows you to send your real-time location, driver details, and expected arrival time to your trusted contacts.'
    },
    
    // Account
    {
      id: 11,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Creating an account is simple! Just provide your mobile number, verify it with OTP, and add your name and email. You can also sign up using Google or Facebook for faster registration.'
    },
    {
      id: 12,
      category: 'account',
      question: 'I forgot my password. What should I do?',
      answer: 'No worries! Click on "Forgot Password" on the login page, enter your registered mobile number or email, and we\'ll send you a reset link or OTP to create a new password.'
    }
  ];

  const quickActions = [
    {
      title: 'Book a Ride',
      description: 'Quick booking for immediate or future rides',
      icon: 'Car',
      href: '/trip-booking-form'
    },
    {
      title: 'Trip History',
      description: 'View your past bookings and invoices',
      icon: 'Clock',
      href: '/trip-history'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: 'Phone',
      href: '/contact-us'
    },
    {
      title: 'Report Issue',
      description: 'Report a problem with your ride',
      icon: 'AlertTriangle',
      href: '/contact-us'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
            <h1 className="fluid-text-4xl font-bold text-foreground mb-6">
              Help Center
            </h1>
            <p className="fluid-text-lg text-muted-foreground mb-8">
              Find answers to common questions and get the help you need
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-12 bg-muted/30"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card p-6 rounded-2xl border border-border hover-lift text-center"
                >
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon name={action.icon} size={24} color="white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-12"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
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

        {/* FAQ List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pb-16"
        >
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No results found. Try a different search term or category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                      <Icon
                        name={expandedFaq === faq.id ? "ChevronUp" : "ChevronDown"}
                        size={20}
                        className="text-muted-foreground flex-shrink-0"
                      />
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                      >
                        <div className="pt-4 border-t border-border">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Contact Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="py-16 lg:py-24 bg-muted/30"
        >
          <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
            <h2 className="fluid-text-3xl font-bold text-foreground mb-4">
              Still Need Help?
            </h2>
            <p className="fluid-text-lg text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact-us"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <Icon name="MessageCircle" size={20} />
                <span>Contact Support</span>
              </motion.a>
              <motion.a
                href="tel:+919876543210"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-card text-card-foreground border border-border px-8 py-3 rounded-xl font-semibold hover:bg-muted/50 transition-colors"
              >
                <Icon name="Phone" size={20} />
                <span>Call Us</span>
              </motion.a>
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

export default HelpCenter;