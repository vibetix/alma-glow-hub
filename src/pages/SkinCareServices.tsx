
import React from 'react';
import { ServiceLayout } from '@/components/ServiceLayout';
import { ServiceDetails } from '@/components/ServiceDetails';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const SkinCareServices = () => {
  return (
    <ServiceLayout
      title="Skin Care Services"
      subtitle="Beauty & Wellness"
      description="Revitalize your skin with our expert treatments designed to nurture, protect, and enhance your natural beauty."
      heroImage="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png"
    >
      {/* Featured Service */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-lg overflow-hidden order-2 lg:order-1"
            >
              <img 
                src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png" 
                alt="Skin Treatment" 
                className="w-full h-auto"
              />
            </motion.div>
            
            <div className="order-1 lg:order-2">
              <motion.h2 
                className="heading-2 mb-6" 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Advanced Skin Care for Radiant Complexion
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Our skin care specialists use the latest techniques and premium products to address all your skin concerns. From deeply hydrating facials to advanced anti-aging treatments, we create personalized solutions that reveal your skin's natural radiance.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Button asChild className="px-8">
                  <a href="#services">View All Treatments <ArrowUpRight size={16} className="ml-2" /></a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services List */}
      <section id="services">
        <ServiceDetails category="skincare" bookingUrl="/booking" />
      </section>
    </ServiceLayout>
  );
};

export default SkinCareServices;
