import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: 'Services',
      links: [
        { label: 'One Way Trips', href: '/trip-booking-form?type=one-way' },
        { label: 'Round Trips', href: '/trip-booking-form?type=round-trip' },
        { label: 'Local Packages', href: '/trip-booking-form?type=local' },
        { label: 'Airport Transfers', href: '/trip-booking-form?type=airport' },
        { label: 'Tour Packages', href: '/package-tours-catalog' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Our Fleet', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Blog', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Safety', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' }
  ];

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/landing-page" className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Icon name="Car" size={20} color="white" />
                </div>
                <span className="text-xl font-bold text-foreground">CabBooker</span>
              </Link>
              
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                Your trusted partner for reliable, safe, and comfortable rides. Book instantly, travel confidently, and experience premium cab services across India.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Mail" size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">support@cabbooker.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Available in 100+ cities</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections?.map((section) => (
              <div key={section?.title}>
                <h3 className="font-semibold text-foreground mb-4">
                  {section?.title}
                </h3>
                <ul className="space-y-3">
                  {section?.links?.map((link) => (
                    <li key={link?.label}>
                      <Link
                        to={link?.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link?.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © {currentYear} CabBooker. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={20} />
                </a>
              ))}
            </div>

            {/* App Download Links */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">Download:</span>
              <a
                href="#"
                className="flex items-center space-x-2 glass-morphism bg-card/50 px-3 py-2 rounded-lg hover:bg-card/70 transition-colors duration-200"
              >
                <Icon name="Smartphone" size={16} className="text-primary" />
                <span className="text-xs font-medium text-foreground">App Store</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 glass-morphism bg-card/50 px-3 py-2 rounded-lg hover:bg-card/70 transition-colors duration-200"
              >
                <Icon name="Smartphone" size={16} className="text-primary" />
                <span className="text-xs font-medium text-foreground">Play Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;