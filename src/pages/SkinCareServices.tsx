
import { ServiceLayout } from '@/components/ServiceLayout';
import { ServiceDetails, ServiceItem } from '@/components/ServiceDetails';
import { motion } from 'framer-motion';

const skinCareServices: ServiceItem[] = [
  {
    name: "Signature Facial",
    description: "Our classic facial includes deep cleansing, exfoliation, extractions, mask, and moisturizer, customized to your skin type.",
    duration: "60 min",
    price: 95,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Anti-Aging Treatment",
    description: "Advanced treatment focused on reducing fine lines and wrinkles, improving skin elasticity and promoting cellular renewal.",
    duration: "75 min",
    price: 125,
    image: "https://images.unsplash.com/photo-1614159102522-46809292f6d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Hydrating Facial",
    description: "Intensely moisturizing treatment designed to replenish and lock in moisture for dry, dehydrated skin.",
    duration: "60 min",
    price: 95,
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Acne Treatment",
    description: "Specialized treatment that targets acne-prone skin with deep cleansing, exfoliation, extractions, and antibacterial treatments.",
    duration: "60 min",
    price: 105,
    image: "https://images.unsplash.com/photo-1501644898242-cfea317d7faf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1746&q=80"
  },
  {
    name: "Chemical Peel",
    description: "Professional-strength exfoliating treatment that removes damaged outer layers of skin to improve texture, tone, and clarity.",
    duration: "45 min",
    price: 120,
    image: "https://images.unsplash.com/photo-1624454002302-52288334e7a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80"
  },
  {
    name: "Microdermabrasion",
    description: "Non-invasive procedure that uses fine crystals to exfoliate the skin, reducing the appearance of fine lines, wrinkles, and acne scars.",
    duration: "45 min",
    price: 110,
    image: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80"
  }
];

const SkinCareServices = () => {
  return (
    <ServiceLayout
      title="Advanced Skin Care"
      subtitle="Rejuvenate & Restore"
      description="Experience transformative skin treatments using cutting-edge techniques and premium products for radiant results."
      heroImage="https://images.unsplash.com/photo-1523263685509-57c1d050d19b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    >
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-2 mb-4">Our Skin Care Treatments</h2>
            <p className="text-gray-600">
              At Alma Beauty, we believe that healthy skin starts with understanding your unique skin type and concerns. Our expert estheticians provide personalized treatments using the finest products and advanced techniques to address your specific needs and help you achieve your skin care goals.
            </p>
          </div>
        </div>
      </section>

      <ServiceDetails 
        services={skinCareServices} 
        bookingUrl="/booking?service=skincare" 
      />
      
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <motion.div 
              className="md:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Alma Skin Care Products" 
                className="rounded-lg shadow-lg"
              />
            </motion.div>
            
            <motion.div 
              className="md:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="heading-2 mb-6">Our Approach to Skin Care</h2>
              <p className="text-gray-600 mb-4">
                We take a holistic approach to skin care, understanding that your skin's appearance reflects your overall health and lifestyle. Our treatments not only address current skin concerns but also help prevent future issues through education and personalized home care recommendations.
              </p>
              <p className="text-gray-600 mb-4">
                We use only medical-grade, results-driven products that are backed by science and free from harmful ingredients. Our estheticians continuously train in the latest techniques and technologies to provide you with the most effective treatments available.
              </p>
              <p className="text-gray-600">
                Whether you're looking to address specific skin concerns like acne or aging, or simply want to maintain healthy, glowing skin, our team is committed to helping you achieve your skin care goals through expert care and guidance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default SkinCareServices;
