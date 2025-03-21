/**
 * Dashboard Page
 * 
 * This page serves as the main dashboard for the affiliate marketing AI agent,
 * providing an overview of all data and insights.
 */

import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Welcome to your Affiliate Marketing AI Agent dashboard. Here you can monitor your data collection,
          trend analysis, competitor research, and progress toward your $10,000 monthly income goal.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Data-Driven Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Get actionable insights based on real-time data analysis from your target niches.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Market Opportunities</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Identify profitable opportunities with high growth potential and low competition.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Income Tracking</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track your progress toward your $10,000 monthly income goal with actionable steps.
            </p>
          </div>
        </div>
      </div>
      
      <Dashboard />
    </div>
  );
}
