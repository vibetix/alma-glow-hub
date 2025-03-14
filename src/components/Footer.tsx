
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-alma-darkGreen text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png" 
              alt="Alma Beauty Logo" 
              className="h-12"
            />
            <p className="text-gray-300 max-w-xs">
              Elevate your beauty experience with our premium spa, skin care, and hair services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-alma-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-alma-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-alma-gold transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-alma-gold">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Shop', 'Book Now', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-gray-300 hover:text-alma-gold transition-colors flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-alma-gold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-alma-gold mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Beauty Lane, Radiance City, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-alma-gold mr-2 flex-shrink-0" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-alma-gold mr-2 flex-shrink-0" />
                <span className="text-gray-300">info@almabeauty.com</span>
              </li>
            </ul>
            <div>
              <h4 className="text-lg font-medium mb-2">Opening Hours</h4>
              <p className="text-gray-300">Mon - Fri: 9:00 AM - 8:00 PM</p>
              <p className="text-gray-300">Sat - Sun: 10:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-alma-gold">Newsletter</h3>
            <p className="text-gray-300">Subscribe to receive updates on our latest services and special offers.</p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="bg-alma-gold hover:bg-opacity-90 text-alma-darkGreen">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Alma Beauty. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-alma-gold text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-alma-gold text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
