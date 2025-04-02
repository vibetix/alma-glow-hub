
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Search, CreditCard, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatCedis } from "@/lib/formatters";

interface Payment {
  id: string;
  orderId: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  method: string;
  status: string;
  date: Date;
  cardInfo: {
    type?: string;
    last4?: string;
  } | null;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchPayments();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('order-payment-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Order/payment change received:', payload);
          fetchPayments();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with payment information
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, user_id, total, status, payment_intent_id, created_at')
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      
      const paymentsData: Payment[] = [];
      
      // For each order, get customer details
      for (const order of (orders || [])) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', order.user_id)
          .maybeSingle();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
        }
        
        // Get user email
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
          order.user_id || ''
        );
        
        if (userError && order.user_id) {
          console.error("Error fetching user data:", userError);
        }
        
        // Determine payment status based on order status
        let paymentStatus = 'pending';
        if (order.status === 'delivered' || order.status === 'shipped') {
          paymentStatus = 'completed';
        } else if (order.status === 'cancelled') {
          paymentStatus = 'failed';
        }
        
        // Create payment object
        const payment: Payment = {
          id: `PAY-${order.id.substring(0, 6)}`,
          orderId: order.id,
          customer: {
            id: order.user_id || 'guest',
            name: profile 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Guest User'
              : 'Guest User',
            email: userData?.user.email || 'guest@example.com'
          },
          amount: order.total,
          method: 'credit_card',
          status: paymentStatus,
          date: new Date(order.created_at),
          cardInfo: order.payment_intent_id 
            ? { type: 'Card', last4: 'xxxx' } 
            : null
        };
        
        paymentsData.push(payment);
      }
      
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Failed to load payments",
        description: "There was an error loading the payment data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter payments based on search and status
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(search.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      payment.customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openDetailsModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  // Get payment method name
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "mobile_money":
        return "Mobile Money";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  // Get status icon based on payment status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout title="Payment Management">
      <div className="space-y-6">
        {/* Payment analytics cards - moved to the top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCedis(
                      payments
                        .filter(p => p.status === "completed")
                        .reduce((sum, payment) => sum + payment.amount, 0)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {payments.filter(p => p.status === "completed").length} completed payments
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCedis(
                      payments
                        .filter(p => p.status === "pending")
                        .reduce((sum, payment) => sum + payment.amount, 0)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {payments.filter(p => p.status === "pending").length} pending payments
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCedis(
                      payments
                        .filter(p => p.status === "failed")
                        .reduce((sum, payment) => sum + payment.amount, 0)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {payments.filter(p => p.status === "failed").length} failed payments
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payments table - now after the analytics cards */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Payments</CardTitle>
                <CardDescription>
                  View and manage customer payments
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    className="pl-8 w-full md:w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <div className="flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Loading payments...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No payments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.orderId.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {payment.customer.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.customer.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(payment.date, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCedis(payment.amount)}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodName(payment.method)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(payment.status)}
                            <span className="ml-2 capitalize">
                              {payment.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetailsModal(payment)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment ID</h3>
                  <p className="font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
                  <p className="font-medium font-mono text-xs">{selectedPayment.orderId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedPayment.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedPayment.customer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p className="font-medium">{format(selectedPayment.date, "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                  <p className="font-medium">{formatCedis(selectedPayment.amount)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="flex items-center">
                    {getStatusIcon(selectedPayment.status)}
                    <span className="ml-2 font-medium capitalize">
                      {selectedPayment.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                <div className="flex items-center mt-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="font-medium">
                    {getPaymentMethodName(selectedPayment.method)}
                  </span>
                </div>
                {selectedPayment.cardInfo && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPayment.cardInfo.type} {selectedPayment.cardInfo.last4 ? `ending in ${selectedPayment.cardInfo.last4}` : ''}
                  </p>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium">Notes</h3>
                {selectedPayment.status === "failed" ? (
                  <p className="text-sm text-red-500 mt-1">
                    Payment failed. The customer's payment was declined.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    No additional notes for this payment.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Payments;
