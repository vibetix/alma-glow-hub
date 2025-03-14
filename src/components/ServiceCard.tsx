
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  className?: string;
}

export const ServiceCard = ({ 
  title, 
  description, 
  imageUrl, 
  href,
  className 
}: ServiceCardProps) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg transition-all duration-500 hover:shadow-xl",
        className
      )}
    >
      <div className="aspect-square md:aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90">
        <div className="absolute bottom-0 left-0 p-6 flex flex-col h-2/3 justify-end">
          <h3 className="font-serif text-2xl font-medium text-white mb-2 transition-all group-hover:translate-y-0">
            {title}
          </h3>
          <p className="text-white/80 text-sm mb-4 max-w-xs opacity-0 -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {description}
          </p>
          <Link
            to={href}
            className="inline-flex items-center text-alma-gold opacity-0 -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
          >
            Explore <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
