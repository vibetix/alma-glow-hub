
import { ServiceLayout } from '@/components/ServiceLayout';
import { ServiceDetails, ServiceItem } from '@/components/ServiceDetails';
import { motion } from 'framer-motion';

const spaServices: ServiceItem[] = [
  {
    name: "Relaxation Massage",
    description: "A gentle, full-body massage designed to relax and rejuvenate. Perfect for stress relief and promoting overall well-being.",
    duration: "60 min",
    price: 85,
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Deep Tissue Massage",
    description: "Targets deeper layers of muscle and connective tissue. Ideal for chronic pain, limited mobility, and recovery from injuries.",
    duration: "60 min",
    price: 95,
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80"
  },
  {
    name: "Hot Stone Massage",
    description: "Smooth, heated stones are placed on specific points on the body to warm and loosen tight muscles and balance energy centers.",
    duration: "75 min",
    price: 110,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Aromatherapy Massage",
    description: "Combines the gentle pressure of Swedish massage with the healing properties of essential oils for a truly immersive experience.",
    duration: "60 min",
    price: 90,
    image: "https://images.unsplash.com/photo-1635248742159-fc51cf12ea04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Prenatal Massage",
    description: "Specifically designed for expectant mothers to relieve tension in the back and reduce swelling in the hands and feet.",
    duration: "60 min",
    price: 85,
    image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80"
  },
  {
    name: "Luxury Spa Package",
    description: "Full body massage, facial treatment, and foot reflexology combined in one luxurious package for complete relaxation.",
    duration: "120 min",
    price: 180,
    image: "https://images.unsplash.com/photo-1596178060810-72f53ce0a073?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  }
];

const SpaServices = () => {
  return (
    <ServiceLayout
      title="Luxury Spa Treatments"
      subtitle="Relaxation & Wellness"
      description="Immerse yourself in relaxation with our range of premium spa services designed to rejuvenate your body and mind."
      heroImage="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    >
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-2 mb-4">Our Spa Services</h2>
            <p className="text-gray-600">
              At Alma Beauty, we offer a range of spa treatments designed to promote relaxation, reduce stress, and enhance your overall well-being. Our experienced therapists use premium products and techniques to provide a truly rejuvenating experience.
            </p>
          </div>
        </div>
      </section>

      <ServiceDetails 
        services={spaServices} 
        bookingUrl="/booking?service=spa" 
      />
      
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-2 mb-6">The Alma Spa Experience</h2>
              <p className="text-gray-600 mb-4">
                Every visit to our spa begins with a personal consultation to understand your specific needs and preferences. Our therapists will recommend treatments tailored to your body's requirements, ensuring a personalized experience.
              </p>
              <p className="text-gray-600 mb-4">
                Our treatment rooms are designed to create a sense of calm and tranquility, with soft lighting, soothing music, and aromatherapy scents that promote relaxation from the moment you enter.
              </p>
              <p className="text-gray-600">
                After your treatment, you're welcome to unwind in our relaxation lounge, where you can enjoy herbal teas and light refreshments while the benefits of your treatment continue to work their magic.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Alma Spa Experience" 
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default SpaServices;
