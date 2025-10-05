'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShoppingCart,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const helpCategories = [
    {
      icon: ShoppingCart,
      title: 'Shopping & Orders',
      color: 'bg-blue-100 text-blue-600',
      items: [
        {
          question: 'How do I place an order?',
          answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit/debit cards, UPI, and net banking.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 30 minutes of placing it. After that, the order will be processed and cannot be cancelled. You can return the item after delivery if needed.'
        },
        {
          question: 'How do I track my order?',
          answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll receive SMS and email updates about your order status.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our payment partners.'
        }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      color: 'bg-green-100 text-green-600',
      items: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 2-3 business days within India. Express shipping options are available for faster delivery. Delivery times may vary based on your location.'
        },
        {
          question: 'Do you ship to all locations in India?',
          answer: 'Yes, we ship to all major cities and towns across India. Some remote locations may have longer delivery times.'
        },
        {
          question: 'What are the shipping charges?',
          answer: 'Shipping is free on orders above ₹1000. For orders below ₹1000, a nominal shipping charge of ₹100 applies.'
        },
        {
          question: 'Can I change my delivery address?',
          answer: 'You can change your delivery address within 30 minutes of placing the order. After that, please contact our customer support team.'
        }
      ]
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refunds',
      color: 'bg-orange-100 text-orange-600',
      items: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some items like electronics may have different return policies.'
        },
        {
          question: 'How do I return an item?',
          answer: 'To return an item, log into your account, go to "My Orders", select the item you want to return, and follow the return process. We\'ll arrange for pickup.'
        },
        {
          question: 'How long does it take to process a refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method.'
        },
        {
          question: 'Are there any items that cannot be returned?',
          answer: 'Personal care items, perishable goods, and customized products cannot be returned. Please check the product description for return eligibility.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'Account & Security',
      color: 'bg-purple-100 text-purple-600',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Sign Up" in the top right corner, enter your details, and verify your email address. You can also sign up using your Google or Facebook account.'
        },
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption to protect your personal information. We never share your data with third parties without your consent.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log into your account, go to "My Profile", and update your information. Make sure to save your changes.'
        }
      ]
    }
  ];

  const allFaqs = helpCategories.flatMap((category, categoryIndex) => 
    category.items.map((item, itemIndex) => ({
      ...item,
      category: category.title,
      globalIndex: categoryIndex * 100 + itemIndex
    }))
  );

  const filteredFaqs = allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions and get the help you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results ({filteredFaqs.length})
            </h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-primary-600 font-medium">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Help Categories */}
        {!searchTerm && (
          <div className="space-y-12">
            {helpCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {category.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => {
                      const globalIndex = categoryIndex * 100 + itemIndex;
                      const isExpanded = expandedItems.includes(globalIndex);
                      
                      return (
                        <Card key={itemIndex}>
                          <CardContent className="p-0">
                            <button
                              onClick={() => toggleExpanded(globalIndex)}
                              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <h3 className="font-semibold text-gray-900">
                                {item.question}
                              </h3>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                            {isExpanded && (
                              <div className="px-6 pb-6">
                                <p className="text-gray-600">
                                  {item.answer}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16 bg-primary-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.open('tel:+917023159912')}
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Support
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.open('mailto:guptasourabh744@gmail.com')}
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.open('/contact')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Form
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
