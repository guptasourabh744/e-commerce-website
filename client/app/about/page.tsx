'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Users, 
  Target, 
  Award, 
  Heart,
  Truck,
  Shield,
  Clock,
  Star
} from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'We deliver your orders within 2-3 business days across India with our reliable shipping partners.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your payments are protected with industry-standard encryption and secure payment gateways.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to help you with any queries.'
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'We carefully curate our products to ensure you get the best quality at competitive prices.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Products Sold' },
    { number: '99%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About Our Store
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are passionate about bringing you the best products at unbeatable prices. 
            Our mission is to make quality products accessible to everyone across India.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To revolutionize online shopping in India by providing a seamless, 
                secure, and enjoyable shopping experience. We aim to connect customers 
                with quality products while supporting local businesses and manufacturers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become India's most trusted and customer-centric e-commerce platform, 
                known for exceptional service, quality products, and innovative solutions 
                that make shopping convenient and enjoyable for everyone.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-primary-600 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sourabh Gupta
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  Founder & CEO
                </p>
                <p className="text-gray-600 text-sm">
                  Passionate about technology and customer satisfaction. 
                  Leading the vision to make quality products accessible to all.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Development Team
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  Tech Experts
                </p>
                <p className="text-gray-600 text-sm">
                  Our dedicated team of developers and designers working 
                  tirelessly to improve your shopping experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Support Team
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  Customer Care
                </p>
                <p className="text-gray-600 text-sm">
                  Our friendly support team is always ready to help you 
                  with any questions or concerns you may have.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer First
              </h3>
              <p className="text-gray-600">
                Every decision we make is guided by what's best for our customers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality Excellence
              </h3>
              <p className="text-gray-600">
                We never compromise on quality and always strive for excellence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Integrity
              </h3>
              <p className="text-gray-600">
                We conduct business with honesty, transparency, and integrity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
