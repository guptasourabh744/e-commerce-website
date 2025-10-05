'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal Information: Name, email address, phone number, shipping address, and payment information.',
        'Account Information: Username, password, and profile preferences.',
        'Usage Data: Information about how you use our website, including pages visited, time spent, and interactions.',
        'Device Information: IP address, browser type, operating system, and device identifiers.',
        'Cookies and Tracking: We use cookies and similar technologies to enhance your experience and analyze usage patterns.'
      ]
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: [
        'To process and fulfill your orders and provide customer service.',
        'To send you order confirmations, shipping updates, and delivery notifications.',
        'To improve our website, products, and services based on your feedback and usage patterns.',
        'To send you promotional emails and newsletters (with your consent).',
        'To prevent fraud and ensure the security of our platform.',
        'To comply with legal obligations and protect our rights.'
      ]
    },
    {
      icon: Lock,
      title: 'Information Security',
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'All sensitive data is encrypted during transmission and storage.',
        'We regularly update our security protocols to address emerging threats.',
        'Access to personal information is restricted to authorized personnel only.',
        'We conduct regular security audits and assessments.',
        'In case of a data breach, we will notify affected users within 72 hours.'
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Rights and Choices',
      content: [
        'Access: You can request access to your personal information we hold.',
        'Correction: You can update or correct your personal information at any time.',
        'Deletion: You can request deletion of your account and associated data.',
        'Portability: You can request a copy of your data in a portable format.',
        'Opt-out: You can unsubscribe from marketing communications at any time.',
        'Restriction: You can request restriction of processing of your personal data.'
      ]
    },
    {
      icon: Globe,
      title: 'Third-Party Services',
      content: [
        'We may share information with trusted third-party service providers who assist us in operating our website.',
        'Payment processors handle your payment information securely.',
        'Shipping partners receive necessary information to deliver your orders.',
        'Analytics providers help us understand website usage and improve our services.',
        'We ensure all third-party partners comply with data protection standards.',
        'We do not sell your personal information to third parties for marketing purposes.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, 
            use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to our e-commerce platform. We are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website or make a purchase.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance 
              with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Data Retention */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Account information: Until you delete your account or request deletion</li>
              <li>• Order information: 7 years for tax and legal compliance purposes</li>
              <li>• Marketing data: Until you unsubscribe or request deletion</li>
              <li>• Analytics data: Aggregated and anonymized data may be retained longer</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you are a parent or guardian and 
              believe your child has provided us with personal information, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You are advised to review this Privacy Policy periodically for any changes. Changes to 
              this Privacy Policy are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 bg-primary-50 border-primary-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, 
              please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> guptasourabh744@gmail.com</p>
              <p><strong>Phone:</strong> +91 7023159912</p>
              <p><strong>Address:</strong> India</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
