import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Safe & Secure',
      description: 'All drivers are verified with background checks and real-time tracking for your safety.',
      color: 'text-success'
    },
    {
      icon: 'Clock',
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you with any queries or emergencies.',
      color: 'text-primary'
    },
    {
      icon: 'CreditCard',
      title: 'Transparent Pricing',
      description: 'No hidden charges. What you see is what you pay with multiple payment options.',
      color: 'text-secondary'
    },
    {
      icon: 'Star',
      title: 'Top Rated Drivers',
      description: 'Professional drivers with high ratings and extensive local knowledge.',
      color: 'text-warning'
    }
  ];

  const certifications = [
    { name: 'ISO 27001', description: 'Data Security' },
    { name: 'PCI DSS', description: 'Payment Security' },
    { name: 'GDPR', description: 'Privacy Compliant' },
    { name: 'RTO Certified', description: 'Government Approved' }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="fluid-text-2xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose CabBooker?
          </h2>
          <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto">
            Your safety and satisfaction are our top priorities. Here's what makes us different.
          </p>
        </motion.div>

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustFeatures?.map((feature, index) => (
            <motion.div
              key={feature?.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-morphism bg-card/50 rounded-xl border border-border p-6 text-center hover:shadow-card hover-lift transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted/50 mb-4`}>
                <Icon name={feature?.icon} size={24} className={feature?.color} />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {feature?.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-morphism bg-card/30 rounded-xl border border-border p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Certified & Compliant
            </h3>
            <p className="text-muted-foreground">
              We maintain the highest standards of security and compliance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications?.map((cert, index) => (
              <motion.div
                key={cert?.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 glass-morphism bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Award" size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold text-card-foreground text-sm mb-1">
                  {cert?.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {cert?.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;