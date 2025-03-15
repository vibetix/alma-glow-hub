
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PageTransition } from './PageTransition';
import { motion } from 'framer-motion';

interface ServiceLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  children: React.ReactNode;
}

export const ServiceLayout = ({
  title,
  subtitle,
  description,
  heroImage,
  children
}: ServiceLayoutProps) => {
  return (
    <>
      <Navbar />
      <PageTransition>
        {/* Hero Section - adding pt-24 (padding-top) to account for navbar height */}
        <section className="relative h-[60vh] flex items-center pt-24">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt={title}
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
                {subtitle}
              </span>
              <h1 className="heading-1 mb-6">{title}</h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">
                {description}
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Content Section */}
        <main>
          {children}
        </main>
      </PageTransition>
      <Footer />
    </>
  );
};
