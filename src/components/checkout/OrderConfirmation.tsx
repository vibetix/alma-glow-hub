
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Truck } from "lucide-react";

interface OrderConfirmationProps {
  orderNumber: string;
  shippingDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
}

export const OrderConfirmation = ({
  orderNumber,
  shippingDetails
}: OrderConfirmationProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center pb-8 border-b">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="heading-2 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-medium mb-4">Order Details</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between pb-3 border-b">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">{orderNumber}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b">
            <span className="text-gray-600">Order Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b">
            <span className="text-gray-600">Payment Method:</span>
            <span>Credit Card ending in 1234</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Method:</span>
            <span>Standard Shipping (3-5 business days)</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
        
        <address className="not-italic">
          <p>{shippingDetails.fullName}</p>
          <p>{shippingDetails.address}</p>
          <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}</p>
          <p>{shippingDetails.country}</p>
          <p>Phone: {shippingDetails.phone}</p>
        </address>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-medium mb-4">What's Next?</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="mr-4">
              <div className="bg-alma-gold/10 w-10 h-10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-alma-gold" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Processing Your Order</h3>
              <p className="text-gray-600">
                We're preparing your items for shipment. You'll receive an email once your order ships.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4">
              <div className="bg-alma-gold/10 w-10 h-10 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-alma-gold" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Shipping & Delivery</h3>
              <p className="text-gray-600">
                Your order will be delivered to your shipping address within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Link to="/shop">
          <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white">
            Continue Shopping
          </Button>
        </Link>
        
        <Link to="/user/orders">
          <Button variant="outline">
            View My Orders
          </Button>
        </Link>
      </div>
    </div>
  );
};
