'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function ShippingInfoPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      duration: '2-3 business days',
      cost: 'Free on orders above ₹1000, ₹100 otherwise',
      description: 'Our standard shipping option with reliable delivery across India',
      icon: Truck
    },
    {
      name: 'Express Shipping',
      duration: '1-2 business days',
      cost: '₹200',
      description: 'Faster delivery for urgent orders',
      icon: Clock
    },
    {
      name: 'Same Day Delivery',
      duration: 'Same day (select cities)',
      cost: '₹500',
      description: 'Available in major metropolitan cities',
      icon: Package
    }
  ];

  const deliveryAreas = [
    {
      region: 'Metro Cities',
      cities: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad',
      duration: '1-2 days',
      icon: CheckCircle
    },
    {
      region: 'Tier 2 Cities',
      cities: 'Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Coimbatore, Kochi',
      duration: '2-3 days',
      icon: CheckCircle
    },
    {
      region: 'Other Cities',
      cities: 'All other major cities and towns',
      duration: '3-5 days',
      icon: CheckCircle
    },
    {
      region: 'Remote Areas',
      cities: 'Remote locations and rural areas',
      duration: '5-7 days',
      icon: AlertCircle
    }
  ];

  const shippingFaqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll also receive SMS and email updates with tracking information.'
    },
    {
      question: 'Can I change my delivery address after placing an order?',
      answer: 'You can change your delivery address within 30 minutes of placing the order. After that, please contact our customer support team for assistance.'
    },
    {
      question: 'What if I\'m not available during delivery?',
      answer: 'Our delivery partner will attempt delivery twice. If you\'re not available, they will leave a calling card with instructions for rescheduling delivery.'
    },
    {
      question: 'Do you deliver on weekends and holidays?',
      answer: 'Yes, we deliver on weekends. However, delivery times may be longer during holidays and festivals.'
    },
    {
      question: 'What if my package is damaged during shipping?',
      answer: 'If your package arrives damaged, please contact us immediately. We will arrange for a replacement or refund as per our return policy.'
    },
    {
      question: 'Can I schedule a specific delivery time?',
      answer: 'Yes, you can request a specific delivery time slot during checkout. We\'ll do our best to accommodate your request.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fast, reliable, and secure shipping across India. Get your orders delivered 
            to your doorstep with our trusted delivery partners.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Shipping Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {option.name}
                    </h3>
                    <p className="text-primary-600 font-semibold mb-2">
                      {option.duration}
                    </p>
                    <p className="text-gray-600 font-medium mb-4">
                      {option.cost}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Delivery Areas & Timeframes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deliveryAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {area.region}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {area.cities}
                        </p>
                        <p className="text-primary-600 font-medium">
                          Delivery Time: {area.duration}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Shipping Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Shipping Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Placed</h3>
              <p className="text-gray-600 text-sm">You place your order and make payment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing</h3>
              <p className="text-gray-600 text-sm">We prepare and pack your order</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipped</h3>
              <p className="text-gray-600 text-sm">Your order is dispatched for delivery</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivered</h3>
              <p className="text-gray-600 text-sm">Your order arrives at your doorstep</p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Important Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Delivery Instructions</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Please provide accurate delivery address</li>
                      <li>• Keep your phone accessible for delivery calls</li>
                      <li>• Someone must be available to receive the package</li>
                      <li>• Check the package for any damage before signing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Delivery Restrictions</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Some areas may have delivery restrictions</li>
                      <li>• Remote locations may take longer</li>
                      <li>• Weather conditions may affect delivery</li>
                      <li>• Festivals and holidays may cause delays</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {shippingFaqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help with Shipping?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help you with any shipping-related questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+917023159912"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Call Support</span>
            </a>
            <a
              href="mailto:guptasourabh744@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
