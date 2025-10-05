'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/AdminRoute';
import { Card, CardContent } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Analytics coming soon - no data fetching needed
    setLoading(false);
  }, []);

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your business performance and insights</p>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-10 w-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Analytics Coming Soon
                </h2>
                <p className="text-gray-600 mb-6">
                  We're working on bringing you comprehensive analytics and insights 
                  to help you track your business performance.
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <p>📊 Revenue tracking and trends</p>
                  <p>📈 Order analytics and growth metrics</p>
                  <p>👥 Customer insights and behavior</p>
                  <p>📦 Product performance analysis</p>
                  <p>🎯 Conversion rate optimization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
