
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
      subtitle="Radiance & Wellness"
      description="Revitalize your skin with our expert treatments designed to nourish, repair, and enhance your natural beauty."
      heroImage="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png"
    >
      {/* Featured Service */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                className="heading-2 mb-6" 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Advanced Skincare for Radiant Results
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Our skincare treatments combine the latest technologies with premium products to address your unique concerns. From anti-aging and hydration to acne treatment and skin rejuvenation, our experts develop personalized solutions that deliver visible, lasting results.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Button asChild className="px-8">
                  <a href="#services">View Skincare Treatments <ArrowUpRight size={16} className="ml-2" /></a>
                </Button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-lg overflow-hidden"
            >
              <img 
                src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png" 
                alt="Skin Care Treatment" 
                className="w-full h-auto"
              />
            </motion.div>
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
