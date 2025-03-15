import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServiceLayout } from '@/components/ServiceLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

// Service types and their details
const serviceTypes = [
  { id: 'spa', name: 'Spa Treatment' },
  { id: 'skincare', name: 'Skincare Service' },
  { id: 'hair', name: 'Hair Service' }
];

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialServiceType = searchParams.get('service') || 'spa';
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [serviceType, setServiceType] = useState(initialServiceType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your appointment",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Booking submitted:", {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      serviceType
    });
    
    toast({
      title: "Booking Confirmed",
      description: `Your ${getServiceTitle()} appointment has been booked for ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime}.`,
    });
    
    setTimeout(() => {
      navigate(`/${serviceType}`);
    }, 2000);
  };

  const getServiceTitle = () => {
    const service = serviceTypes.find(s => s.id === serviceType);
    return service ? service.name : 'Service';
  };

  const getHeroImage = () => {
    switch(serviceType) {
      case 'spa':
        return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
      case 'skincare':
        return "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
      case 'hair':
        return "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80";
      default:
        return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";
    }
  };

  return (
    <ServiceLayout
      title={`Schedule Your ${getServiceTitle()}`}
      subtitle="Book Your Appointment"
      description="Select your preferred date and time and provide your details to book your appointment."
      heroImage={getHeroImage()}
    >
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="heading-3">Service Details</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select 
                      value={serviceType} 
                      onValueChange={setServiceType}
                    >
                      <SelectTrigger id="serviceType" className="w-full">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="heading-3">Select Date & Time</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Appointment Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="date"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            className="pointer-events-auto"
                            disabled={(date) => 
                              date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                              date.getDay() === 0
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Appointment Time</Label>
                      <Select onValueChange={setSelectedTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time">
                            {selectedTime ? (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" /> {selectedTime}
                              </div>
                            ) : (
                              "Select time"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" /> {time}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="heading-3">Your Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="Your email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        placeholder="Your phone number" 
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests or Notes</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      placeholder="Any special requests or information we should know about?" 
                      rows={4}
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="bg-alma-gold hover:bg-alma-gold/90 text-white w-full md:w-auto px-8">
                  Confirm Booking
                </Button>
              </form>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-alma-lightgray p-6 rounded-lg space-y-6">
                <h2 className="heading-3">Booking Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Service Type</h4>
                    <p className="text-gray-600">{getServiceTitle()}</p>
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <h4 className="font-medium text-gray-700">Date</h4>
                      <p className="text-gray-600">{format(selectedDate, 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div>
                      <h4 className="font-medium text-gray-700">Time</h4>
                      <p className="text-gray-600">{selectedTime}</p>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    Please arrive 15 minutes before your scheduled appointment time. If you need to cancel or reschedule, please do so at least 24 hours in advance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default Booking;
