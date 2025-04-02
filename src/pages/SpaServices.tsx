
import React from 'react';
import { ServiceLayout } from '@/components/ServiceLayout';
import { ServiceDetails } from '@/components/ServiceDetails';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const SpaServices = () => {
  return (
    <ServiceLayout
      title="Spa Services"
      subtitle="Relaxation & Wellness"
      description="Immerse yourself in tranquility with our rejuvenating spa treatments designed to soothe your body and calm your mind."
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
                Experience the Ultimate Relaxation
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Our spa services are designed to transport you to a state of complete relaxation and rejuvenation. From therapeutic massages and body treatments to aromatherapy sessions, each service is crafted to provide a holistic wellness experience that nurtures both body and mind.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Button asChild className="px-8">
                  <a href="#services">Discover Our Spa Menu <ArrowUpRight size={16} className="ml-2" /></a>
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
                alt="Spa Treatment" 
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services List */}
      <section id="services">
        <ServiceDetails category="spa" bookingUrl="/booking" />
      </section>
    </ServiceLayout>
  );
};

export default SpaServices;
