import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import Footer from '../landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const AboutUs = () => {
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

  const stats = [
    { icon: 'Users', label: 'Happy Customers', value: '50,000+' },
    { icon: 'Car', label: 'Rides Completed', value: '1,00,000+' },
    { icon: 'MapPin', label: 'Cities Covered', value: '100+' },
    { icon: 'Clock', label: 'Years of Service', value: '5+' }
  ];

  const values = [
    {
      icon: 'Shield',
      title: 'Safety First',
      description: 'We prioritize your safety with verified drivers, GPS tracking, and 24/7 support.'
    },
    {
      icon: 'Heart',
      title: 'Customer Centric',
      description: 'Your satisfaction is our priority. We go the extra mile to exceed expectations.'
    },
    {
      icon: 'Zap',
      title: 'Innovation',
      description: 'We continuously innovate to provide you with the best booking and travel experience.'
    },
    {
      icon: 'Users',
      title: 'Community',
      description: 'We believe in building strong relationships with our customers and partners.'
    }
  ];

  const milestones = [
    { year: '2019', event: 'CabBooker was founded with a vision to revolutionize taxi booking' },
    { year: '2020', event: 'Launched in 10 cities with 500+ drivers onboarded' },
    { year: '2021', event: 'Expanded to 50 cities and introduced package tours' },
    { year: '2022', event: 'Reached 25,000+ happy customers milestone' },
    { year: '2023', event: 'Launched premium services and expanded to 100+ cities' },
    { year: '2024', event: 'Introduced AI-powered route optimization and 24/7 support' }
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
              About CabBooker
            </h1>
            <p className="fluid-text-lg text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to make transportation simple, safe, and reliable for everyone. 
              Since 2019, we've been connecting passengers with trusted drivers across India, 
              providing seamless travel experiences one ride at a time.
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

        {/* Our Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="fluid-text-3xl font-bold text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    CabBooker was born from a simple idea: transportation should be accessible, 
                    reliable, and stress-free for everyone. Our founders, frustrated with the 
                    existing taxi booking services, decided to create a platform that truly 
                    puts customers first.
                  </p>
                  <p>
                    What started as a small team of tech enthusiasts has grown into one of 
                    India's most trusted cab booking platforms. We've maintained our core 
                    values of safety, reliability, and customer satisfaction while scaling 
                    across 100+ cities.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of customers daily, connecting them 
                    with verified drivers and ensuring every journey is safe and comfortable.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Car" size={48} className="text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Our Journey Continues</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Our Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="py-16 lg:py-24 bg-muted/30"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="fluid-text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do and shape the experience we deliver
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card p-6 rounded-2xl border border-border hover-lift"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={value.icon} size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Timeline Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="py-16 lg:py-24"
        >
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 className="fluid-text-3xl font-bold text-foreground mb-4">Our Journey</h2>
              <p className="fluid-text-lg text-muted-foreground">
                Key milestones in our growth story
              </p>
            </div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-6"
                >
                  <div className="w-20 flex-shrink-0 text-center">
                    <div className="text-lg font-bold text-primary">{milestone.year}</div>
                  </div>
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="py-16 lg:py-24 bg-primary/5"
        >
          <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
            <h2 className="fluid-text-3xl font-bold text-foreground mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="fluid-text-lg text-muted-foreground mb-8">
              Join thousands of satisfied customers who trust CabBooker for their daily commute and travel needs.
            </p>
            <motion.a
              href="/trip-booking-form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <span>Book Your First Ride</span>
              <Icon name="ArrowRight" size={20} />
            </motion.a>
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

export default AboutUs;