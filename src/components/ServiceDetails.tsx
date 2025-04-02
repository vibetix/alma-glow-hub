
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Service } from '@/types/database';

export interface ServiceItem extends Service {}

interface ServiceDetailsProps {
  category: string;
  bookingUrl: string;
}

export const ServiceDetails = ({ category, bookingUrl }: ServiceDetailsProps) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('category', category);
        
        if (error) {
          throw error;
        }
        
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [category]);

  if (loading) {
    return (
      <div className="py-16 bg-alma-lightgray min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-alma-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-alma-lightgray min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-alma-lightgray">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.length > 0 ? (
            services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="bg-white rounded-lg overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {service.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={service.image_url} 
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
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-8">
              <p className="text-gray-500">No services found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
