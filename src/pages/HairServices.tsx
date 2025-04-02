
import React from 'react';
import { ServiceLayout } from '@/components/ServiceLayout';
import { ServiceDetails } from '@/components/ServiceDetails';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const HairServices = () => {
  return (
    <ServiceLayout
      title="Hair Services"
      subtitle="Beauty & Hair"
      description="Transform your look with our expert hair services, from cutting-edge styling to nourishing treatments."
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
                Expert Hair Services for Every Style
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Our team of skilled stylists offers a wide range of hair services to help you achieve your perfect look. From precision cuts and vibrant colors to luxurious treatments and extensions, we customize every service to match your unique style and hair needs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Button asChild className="px-8">
                  <a href="#services">Explore Our Services <ArrowUpRight size={16} className="ml-2" /></a>
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
                alt="Hair styling" 
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services List */}
      <section id="services">
        <ServiceDetails category="hair" bookingUrl="/booking" />
      </section>
    </ServiceLayout>
  );
};

export default HairServices;
