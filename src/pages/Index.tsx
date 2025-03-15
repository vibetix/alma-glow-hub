import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CalendarClock, Sparkles, Award, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ServiceCard } from '@/components/ServiceCard';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const services = [
    {
      title: "Luxury Spa Treatments",
      description: "Immerse yourself in relaxation with our range of premium spa services designed to rejuvenate your body and mind.",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      href: "/spa"
    },
    {
      title: "Advanced Skin Care",
      description: "Experience transformative skin treatments using cutting-edge techniques and premium products for radiant results.",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      href: "/skincare"
    },
    {
      title: "Professional Hair Services",
      description: "Transform your look with our expert hair stylists offering cutting, coloring, and styling services for all hair types.",
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80",
      href: "/hair"
    }
  ];

  const testimonials = [
    {
      quote: "Alma Beauty transformed my skincare routine. Their personalized approach and premium products have made a significant difference.",
      author: "Emily Johnson",
      title: "Regular Client"
    },
    {
      quote: "The spa experience at Alma Beauty is second to none. Their attention to detail and luxurious treatments are truly exceptional.",
      author: "Michael Chen",
      title: "Verified Customer"
    },
    {
      quote: "I've never felt more pampered than during my visit to Alma Beauty. Their hair services are worth every penny.",
      author: "Sarah Williams",
      title: "First-time Visitor"
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
            alt="Beauty salon background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        
        <div className="container-custom relative z-10 pt-20">
          <motion.div 
            className="max-w-2xl text-white"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.span 
              className="inline-block px-3 py-1 bg-alma-gold/20 text-alma-gold rounded-full text-sm font-medium mb-4"
              variants={fadeIn}
            >
              Discover True Beauty
            </motion.span>
            
            <motion.h1 
              className="heading-1 mb-6"
              variants={fadeIn}
            >
              Elevate Your Beauty <br />
              <span className="text-alma-gold">Experience</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-white/80 mb-8 max-w-xl"
              variants={fadeIn}
            >
              Experience premium spa, skin care, and hair services tailored to enhance your natural beauty and well-being.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={fadeIn}
            >
              <Button asChild className="btn-primary">
                <Link to="/booking">Book Appointment</Link>
              </Button>
              
              <Button asChild variant="outline" className="btn-secondary">
                <Link to="/services">Explore Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <a 
              href="#services" 
              className="text-white flex flex-col items-center"
              aria-label="Scroll to services"
            >
              <span className="text-sm mb-2">Discover More</span>
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <motion.div 
                  className="w-1 h-2 bg-white rounded-full mt-2"
                  animate={{ 
                    y: [0, 12, 0],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />
              </div>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-alma-lightgray">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Our Services</span>
            <h2 className="heading-2 mt-2 mb-4">Premium Beauty Services</h2>
            <p className="text-gray-600">
              Discover our range of luxurious treatments designed to enhance your natural beauty and provide a rejuvenating experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="btn-secondary">
              <Link to="/services" className="inline-flex items-center">
                View All Services <ChevronRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* About/Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Why Choose Us</span>
              <h2 className="heading-2 mt-2 mb-6">Experience Beauty <br />Like Never Before</h2>
              <p className="text-gray-600 mb-8">
                At Alma Beauty, we believe in enhancing your natural beauty through personalized services using premium products and cutting-edge techniques. Our team of certified professionals is dedicated to providing exceptional care tailored to your unique needs.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: CalendarClock, title: "Convenient Booking", description: "Effortless appointment scheduling online or by phone" },
                  { icon: Sparkles, title: "Premium Products", description: "Using only high-quality, natural ingredients" },
                  { icon: Award, title: "Expert Professionals", description: "Certified and experienced beauty specialists" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 bg-alma-gold/10 p-2 rounded-full text-alma-gold">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button asChild className="btn-primary">
                <Link to="/about">About Us</Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative z-10 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                  alt="About Alma Beauty"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-alma-gold/20 rounded-lg -z-10"></div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-alma-gold/10 rounded-lg -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-alma-black text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Testimonials</span>
            <h2 className="heading-2 mt-2 mb-4">What Our Clients Say</h2>
            <p className="text-white/80">
              Discover why our clients choose Alma Beauty for their beauty and wellness needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10"
              >
                <svg className="text-alma-gold h-8 w-8 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
                </svg>
                <p className="mb-4 text-white/90">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-alma-gold/20">
                    <div className="w-full h-full flex items-center justify-center text-alma-gold">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-white/60">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80" 
            alt="Spa background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto text-center"
          >
            <span className="text-alma-gold inline-block px-3 py-1 bg-alma-gold/10 rounded-full text-sm font-medium mb-4">
              Limited Time Offer
            </span>
            <h2 className="heading-3 mb-4">Enjoy 20% Off Your First Visit</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Book your first appointment today and receive 20% off any service. Experience the luxury and expertise that Alma Beauty has to offer.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="btn-primary">
                <Link to="/booking">Book Now</Link>
              </Button>
              <Button asChild variant="outline" className="btn-secondary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default HomePage;
