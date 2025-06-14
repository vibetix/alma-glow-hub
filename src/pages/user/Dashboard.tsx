
import { useAuth } from '@/contexts/AuthContext';
import { UserLayout } from '@/components/UserLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Heart, 
  Calendar, 
  MapPin,
  ShoppingBag,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();

  const quickStats = [
    {
      title: 'Total Orders',
      value: '12',
      icon: Package,
      href: '/user/orders',
      color: 'text-blue-600'
    },
    {
      title: 'Wishlist Items',
      value: '5',
      icon: Heart,
      href: '/user/wishlist',
      color: 'text-red-600'
    },
    {
      title: 'Appointments',
      value: '3',
      icon: Calendar,
      href: '/user/appointments',
      color: 'text-green-600'
    },
    {
      title: 'Saved Addresses',
      value: '2',
      icon: MapPin,
      href: '/user/addresses',
      color: 'text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Discover our latest beauty products',
      href: '/shop',
      icon: ShoppingBag,
      color: 'bg-alma-gold'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule your next spa or beauty treatment',
      href: '/booking',
      icon: Calendar,
      color: 'bg-alma-darkGreen'
    },
    {
      title: 'View Orders',
      description: 'Track your recent purchases',
      href: '/user/orders',
      icon: Package,
      color: 'bg-blue-600'
    }
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-serif text-alma-darkGreen mb-2">
            Welcome back, {user?.name || 'Valued Customer'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your account and recent activity.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-alma-darkGreen">{stat.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-alma-darkGreen">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to do
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.href}>
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-medium text-alma-darkGreen">{action.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-alma-darkGreen">Recent Activity</CardTitle>
            <CardDescription>
              Your latest orders and appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Order #ORD-2024-001</p>
                    <p className="text-sm text-gray-600">Delivered on Dec 10, 2024</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Facial Treatment</p>
                    <p className="text-sm text-gray-600">Scheduled for Dec 15, 2024</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Reschedule</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Product Review</p>
                    <p className="text-sm text-gray-600">Please review your recent purchase</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Write Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
