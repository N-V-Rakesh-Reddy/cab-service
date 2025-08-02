import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onGetStarted = () => {} }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="City traffic at night"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 glass-morphism bg-white/10 rounded-full px-4 py-2 mb-6"
          >
            <Icon name="Zap" size={16} className="text-primary" />
            <span className="text-sm font-medium text-white">
              Trusted by 50,000+ riders
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="fluid-text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Your Reliable Ride,{' '}
            <span className="text-primary">Anytime</span>
            <br />
            <span className="text-primary">Anywhere</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="fluid-text-lg lg:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Book premium cabs instantly with transparent pricing, professional drivers, and 24/7 support. From quick city rides to airport transfers and tour packages.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <Button
              variant="default"
              size="lg"
              onClick={onGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
            >
              Book Your Ride
            </Button>
            
            <Link to="/package-tours-catalog">
              <Button
                variant="outline"
                size="lg"
                iconName="MapPin"
                iconPosition="left"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10"
              >
                Explore Packages
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-gray-300">Happy Riders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-gray-300">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">4.8★</div>
              <div className="text-sm text-gray-300">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">100+</div>
              <div className="text-sm text-gray-300">Cities</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-sm text-gray-300">Scroll to explore</span>
          <Icon name="ChevronDown" size={20} className="text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;