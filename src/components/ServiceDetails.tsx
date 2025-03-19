
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface ServiceItem {
  name: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
}

interface ServiceDetailsProps {
  services: ServiceItem[];
  bookingUrl: string;
}

export const ServiceDetails = ({ services, bookingUrl }: ServiceDetailsProps) => {
  return (
    <section className="py-16 bg-alma-lightgray">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div 
              key={service.name}
              className="bg-white rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {service.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-serif font-medium">{service.name}</h3>
                  <div className="text-alma-gold font-medium">₵{service.price}</div>
                </div>
                <p className="text-gray-600 mb-3">{service.description}</p>
                <div className="text-sm text-gray-500 mb-6">Duration: {service.duration}</div>
                <Button asChild className="w-full">
                  <Link to={bookingUrl}>Book Now</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
