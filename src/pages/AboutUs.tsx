
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Award, Heart, Clock, MapPin, PhoneCall, Mail } from 'lucide-react';

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

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <PageTransition>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              alt="About Alma Beauty"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
          
          <div className="container-custom relative z-10">
            <motion.div 
              className="max-w-2xl text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-alma-gold/20 text-alma-gold rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h1 className="heading-1 mb-6">About Alma Beauty</h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">
                Discover the passion and expertise behind our premium beauty services and products.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Our Story</span>
                <h2 className="heading-2 mt-2 mb-6">A Journey of Beauty <br />and Excellence</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2010, Alma Beauty began with a simple mission: to provide exceptional beauty services that enhance natural beauty while promoting overall wellness. What started as a small salon has grown into a comprehensive beauty destination offering a wide range of premium services and products.
                </p>
                <p className="text-gray-600 mb-4">
                  Our founder, Isabella Martinez, believed that beauty treatments should be both effective and nurturing. Drawing from her background in dermatology and aesthetics, she created a space where cutting-edge techniques meet holistic wellness principles.
                </p>
                <p className="text-gray-600 mb-4">
                  Today, Alma Beauty is recognized as a leader in the beauty industry, known for our commitment to quality, innovation, and personalized care. Our team of certified professionals continues to uphold Isabella's vision, ensuring every client leaves feeling confident, refreshed, and beautiful.
                </p>
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
                    src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                    alt="Our Story"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-alma-gold/20 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-64 h-64 bg-alma-gold/10 rounded-lg -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-20 bg-alma-lightgray">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Our Values</span>
              <h2 className="heading-2 mt-2 mb-4">What We Stand For</h2>
              <p className="text-gray-600">
                At Alma Beauty, our core values guide everything we do, from the products we select to the services we provide.
              </p>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Heart,
                  title: "Quality & Excellence",
                  description: "We are committed to using only premium products and delivering exceptional services that exceed expectations."
                },
                {
                  icon: Users,
                  title: "Client-Centered Approach",
                  description: "We prioritize understanding each client's unique needs and preferences to provide truly personalized experiences."
                },
                {
                  icon: Award,
                  title: "Expertise & Innovation",
                  description: "Our team continuously pursues advanced training to stay at the forefront of beauty trends and techniques."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white p-8 rounded-lg shadow-sm"
                >
                  <div className="w-12 h-12 bg-alma-gold/10 rounded-full flex items-center justify-center text-alma-gold mb-6">
                    <value.icon size={24} />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Our Team</span>
              <h2 className="heading-2 mt-2 mb-4">Meet Our Experts</h2>
              <p className="text-gray-600">
                Our team of certified professionals is dedicated to providing exceptional beauty services.
              </p>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  name: "Isabella Martinez",
                  title: "Founder & Lead Aesthetician",
                  image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                },
                {
                  name: "Michael Chen",
                  title: "Senior Hair Stylist",
                  image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80"
                },
                {
                  name: "Sofia Rodriguez",
                  title: "Spa Therapist",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80"
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="text-center"
                >
                  <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                  <p className="text-alma-gold">{member.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Location & Contact Section */}
        <section className="py-20 bg-alma-black text-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Visit Us</span>
                <h2 className="heading-2 mt-2 mb-6 text-white">Our Location</h2>
                
                <div className="mb-8">
                  <div className="rounded-lg overflow-hidden h-[300px]">
                    <img 
                      src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Our Location" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 bg-alma-gold/10 p-2 rounded-full text-alma-gold">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Address</h3>
                      <p className="text-white/80">123 Beauty Lane, Suite 100<br />Los Angeles, CA 90210</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-alma-gold text-sm font-medium tracking-widest uppercase">Get in Touch</span>
                <h2 className="heading-2 mt-2 mb-6 text-white">Contact Us</h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="mr-4 bg-alma-gold/10 p-2 rounded-full text-alma-gold">
                      <PhoneCall size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Phone</h3>
                      <p className="text-white/80">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-alma-gold/10 p-2 rounded-full text-alma-gold">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email</h3>
                      <p className="text-white/80">info@almabeauty.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-alma-gold/10 p-2 rounded-full text-alma-gold">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Hours</h3>
                      <p className="text-white/80">
                        Monday - Friday: 9am - 8pm<br />
                        Saturday: 9am - 6pm<br />
                        Sunday: 10am - 4pm
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button asChild className="bg-alma-gold hover:bg-alma-gold/90 text-black">
                  <Link to="/booking">Book an Appointment</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-alma-lightgray rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="heading-3 mb-4">Ready to Experience Alma Beauty?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Book your appointment today and discover why our clients choose us for their beauty needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-alma-gold hover:bg-alma-gold/90 text-black">
                  <Link to="/booking">Book Now</Link>
                </Button>
                <Button asChild variant="outline" className="border-alma-darkGreen text-alma-darkGreen hover:bg-alma-darkGreen/10">
                  <Link to="/shop">Shop Products</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </>
  );
};

export default AboutUs;
