
import { useState } from "react";
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
import { Search, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock data for payments
const PAYMENTS = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    amount: 119.97,
    method: "credit_card",
    status: "completed",
    date: new Date(2023, 6, 15),
    cardInfo: {
      type: "Visa",
      last4: "4242",
    },
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    amount: 29.99,
    method: "credit_card",
    status: "completed",
    date: new Date(2023, 6, 18),
    cardInfo: {
      type: "Mastercard",
      last4: "1234",
    },
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    customer: {
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
    },
    amount: 63.97,
    method: "mobile_money",
    status: "pending",
    date: new Date(2023, 6, 20),
    cardInfo: null,
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
    },
    amount: 79.98,
    method: "credit_card",
    status: "failed",
    date: new Date(2023, 6, 22),
    cardInfo: {
      type: "Visa",
      last4: "8765",
    },
  },
  {
    id: "PAY-005",
    orderId: "ORD-005",
    customer: {
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
    },
    amount: 50.98,
    method: "cash_on_delivery",
    status: "completed",
    date: new Date(2023, 6, 25),
    cardInfo: null,
  },
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
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

const Payments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filter payments based on search and status
  const filteredPayments = PAYMENTS.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(search.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      payment.customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openDetailsModal = (payment: any) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  return (
    <AdminLayout title="Payment Management">
      <div className="space-y-6">
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
                  {filteredPayments.length === 0 ? (
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
                        <TableCell>{payment.orderId}</TableCell>
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
                          {formatCurrency(payment.amount)}
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

        {/* Payment analytics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  PAYMENTS
                    .filter(p => p.status === "completed")
                    .reduce((sum, payment) => sum + payment.amount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {PAYMENTS.filter(p => p.status === "completed").length} completed payments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  PAYMENTS
                    .filter(p => p.status === "pending")
                    .reduce((sum, payment) => sum + payment.amount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {PAYMENTS.filter(p => p.status === "pending").length} pending payments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  PAYMENTS
                    .filter(p => p.status === "failed")
                    .reduce((sum, payment) => sum + payment.amount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {PAYMENTS.filter(p => p.status === "failed").length} failed payments
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment ID</h3>
                  <p className="font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
                  <p className="font-medium">{selectedPayment.orderId}</p>
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
                  <p className="font-medium">{formatCurrency(selectedPayment.amount)}</p>
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
                    {selectedPayment.cardInfo.type} ending in {selectedPayment.cardInfo.last4}
                  </p>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium">Notes</h3>
                {selectedPayment.status === "failed" ? (
                  <p className="text-sm text-red-500 mt-1">
                    Payment failed. The customer's card was declined.
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
