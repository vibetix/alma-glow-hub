
import { ServiceLayout } from '@/components/ServiceLayout';
import { ServiceDetails, ServiceItem } from '@/components/ServiceDetails';
import { motion } from 'framer-motion';

const hairServices: ServiceItem[] = [
  {
    name: "Women's Haircut & Style",
    description: "Precision cut and professional styling tailored to your face shape, hair texture, and personal style.",
    duration: "60 min",
    price: 65,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80"
  },
  {
    name: "Men's Haircut",
    description: "Classic or modern cut with attention to detail, includes styling with premium products.",
    duration: "45 min",
    price: 40,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Root Color",
    description: "Professional color application to cover roots and maintain your desired hair color.",
    duration: "90 min",
    price: 80,
    image: "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80"
  },
  {
    name: "Full Highlights",
    description: "Dimensional color throughout your hair creating depth and brightness for a natural or bold look.",
    duration: "120 min",
    price: 135,
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
  },
  {
    name: "Balayage",
    description: "Hand-painted highlights creating a graduated, natural-looking effect with less noticeable regrowth.",
    duration: "150 min",
    price: 170,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80"
  },
  {
    name: "Deep Conditioning Treatment",
    description: "Intensive treatment to restore moisture, repair damage, and enhance shine and softness.",
    duration: "30 min",
    price: 45,
    image: "https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
  },
  {
    name: "Bridal/Special Event Styling",
    description: "Elegant updo or styling for weddings, proms, or special occasions, customized to complement your outfit and event.",
    duration: "90 min",
    price: 120,
    image: "https://images.unsplash.com/photo-1457972703743-4a6585c42ed8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Brazilian Blowout",
    description: "Professional smoothing treatment that reduces frizz and curl while adding incredible shine and manageability.",
    duration: "120 min",
    price: 250,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  }
];

const HairServices = () => {
  return (
    <ServiceLayout
      title="Professional Hair Services"
      subtitle="Style & Transform"
      description="Transform your look with our expert hair stylists offering cutting, coloring, and styling services for all hair types."
      heroImage="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80"
    >
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-2 mb-4">Our Hair Services</h2>
            <p className="text-gray-600">
              At Alma Beauty, our team of expert stylists is dedicated to helping you achieve your hair goals. Whether you're looking for a subtle change or a complete transformation, we work closely with you to create a look that complements your features, lifestyle, and personal style.
            </p>
          </div>
        </div>
      </section>

      <ServiceDetails 
        services={hairServices} 
        bookingUrl="/booking?service=hair" 
      />
      
      <section className="py-16 bg-alma-lightgray">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="heading-2 mb-6">The Alma Hair Experience</h2>
              <p className="text-gray-600 mb-4">
                Your experience begins with a thorough consultation to understand your desires, lifestyle, and hair concerns. Our stylists take into account your face shape, hair texture, and personal style to create a customized look that enhances your natural beauty.
              </p>
              <p className="text-gray-600 mb-4">
                We use only premium hair products that protect and nourish your hair while providing exceptional results. Our color services utilize low-ammonia or ammonia-free formulas that minimize damage while delivering vibrant, long-lasting color.
              </p>
              <p className="text-gray-600">
                Before you leave, our stylists will share tips and techniques for maintaining your new look at home, ensuring your hair looks salon-fresh every day.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                  alt="Hair Styling" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80" 
                  alt="Hair Cutting" 
                  className="rounded-lg shadow-md w-full h-auto mt-8"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default HairServices;
