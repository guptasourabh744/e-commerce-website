'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  CreditCard,
  Truck,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and go to "My Orders" to start the return process',
      icon: Package
    },
    {
      step: 2,
      title: 'Select Items',
      description: 'Choose the items you want to return and provide a reason',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'We\'ll arrange for pickup of your return package',
      icon: Truck
    },
    {
      step: 4,
      title: 'Get Refund',
      description: 'Once we receive and verify your return, we\'ll process your refund',
      icon: CreditCard
    }
  ];

  const returnPolicy = [
    {
      category: 'Eligible Items',
      items: [
        'Items in original condition with tags attached',
        'Unused and unopened products',
        'Items with manufacturing defects',
        'Wrong items received',
        'Damaged items during shipping'
      ],
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      category: 'Non-Eligible Items',
      items: [
        'Personal care and hygiene products',
        'Perishable goods and food items',
        'Customized or personalized products',
        'Items without original packaging',
        'Items damaged by misuse or wear'
      ],
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  const returnFaqs = [
    {
      question: 'How long do I have to return an item?',
      answer: 'You have 30 days from the delivery date to initiate a return for most items. Some categories may have different return periods.'
    },
    {
      question: 'How do I start a return?',
      answer: 'Log into your account, go to "My Orders", select the order you want to return, and follow the return process. You can also contact our customer support team.'
    },
    {
      question: 'Who pays for return shipping?',
      answer: 'We provide free return shipping for defective items, wrong items, or items damaged during shipping. For other returns, return shipping charges may apply.'
    },
    {
      question: 'How long does it take to process a refund?',
      answer: 'Refunds are processed within 5-7 business days after we receive and verify your returned item. The amount will be credited to your original payment method.'
    },
    {
      question: 'Can I exchange an item instead of returning it?',
      answer: 'Yes, you can request an exchange for a different size, color, or variant of the same product. Exchange requests are subject to availability.'
    },
    {
      question: 'What if I receive a damaged item?',
      answer: 'If you receive a damaged item, please contact us immediately with photos. We will arrange for a replacement or full refund at no cost to you.'
    }
  ];

  const refundMethods = [
    {
      method: 'Credit/Debit Card',
      duration: '5-7 business days',
      description: 'Refund will be credited to your original payment method'
    },
    {
      method: 'UPI',
      duration: '2-3 business days',
      description: 'Refund will be credited to your UPI account'
    },
    {
      method: 'Net Banking',
      duration: '3-5 business days',
      description: 'Refund will be credited to your bank account'
    },
    {
      method: 'Store Credit',
      duration: '1-2 business days',
      description: 'Refund will be added to your account as store credit'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Returns & Refunds
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to be completely satisfied with your purchase. Our hassle-free 
            return policy makes it easy to return or exchange items.
          </p>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Return an Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Return Policy */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Return Policy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {returnPolicy.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Icon className={`h-6 w-6 ${policy.color} mr-3`} />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {policy.category}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {policy.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className={`w-2 h-2 ${policy.color.replace('text-', 'bg-')} rounded-full mt-2 mr-3 flex-shrink-0`}></span>
                          <span className="text-gray-600 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
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
                    <h3 className="font-semibold text-gray-900 mb-2">Return Conditions</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Items must be in original condition</li>
                      <li>• Original packaging and tags must be intact</li>
                      <li>• Items must not be used or damaged</li>
                      <li>• Return request must be initiated within 30 days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Return Charges</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Free returns for defective items</li>
                      <li>• Free returns for wrong items</li>
                      <li>• Free returns for damaged items</li>
                      <li>• Return shipping charges may apply for other cases</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Refund Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Refund Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refundMethods.map((method, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {method.method}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {method.duration}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {returnFaqs.map((faq, index) => (
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

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Start a Return
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Log into your account to initiate a return
                </p>
                <Button className="w-full">
                  Return Item
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Track Return
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Check the status of your return
                </p>
                <Button variant="outline" className="w-full">
                  Track Status
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Request Exchange
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Exchange for a different size or color
                </p>
                <Button variant="outline" className="w-full">
                  Exchange Item
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help with Returns?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help you with any return-related questions or concerns.
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
