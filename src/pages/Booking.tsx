
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
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

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const serviceType = searchParams.get('service') || 'spa';
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
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
    
    // In a real application, this would send data to the server
    console.log("Booking submitted:", {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      serviceType
    });
    
    toast({
      title: "Booking Confirmed",
      description: `Your ${serviceType} appointment has been booked for ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime}.`,
    });
    
    // Navigate back to the relevant service page
    setTimeout(() => {
      navigate(`/${serviceType}`);
    }, 2000);
  };

  // Get service title based on type
  const getServiceTitle = () => {
    switch(serviceType) {
      case 'spa':
        return 'Spa Treatment';
      case 'skincare':
        return 'Skincare Service';
      case 'hair':
        return 'Hair Service';
      default:
        return 'Service';
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <section className="relative h-[40vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src={
                serviceType === 'spa'
                  ? "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                  : serviceType === 'skincare'
                  ? "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                  : "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80"
              }
              alt="Booking"
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
                Book Your Appointment
              </span>
              <h1 className="heading-1 mb-6">Schedule Your {getServiceTitle()}</h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">
                Select your preferred date and time and provide your details to book your appointment.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
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
      </PageTransition>
      <Footer />
    </>
  );
};

export default Booking;
