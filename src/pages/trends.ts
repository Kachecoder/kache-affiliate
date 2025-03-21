/**
 * Trends Page
 * 
 * This page provides the user interface for analyzing and visualizing
 * trend data for affiliate marketing niches, products, and keywords.
 */

import React, { useState } from 'react';
import TrendVisualization from '../components/trends/TrendVisualization';
import TrendInsights from '../components/trends/TrendInsights';

export default function TrendsPage() {
  const [activeTab, setActiveTab] = useState('visualization');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trend Research</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Analyze market trends to identify profitable opportunities in your target niches.
          This data will help you focus your limited budget on the most promising products and keywords.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Niche Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Identify which niches are growing in popularity and have the best profit potential.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Keyword Trends</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Discover trending keywords and topics that can drive traffic to your affiliate offers.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Product Opportunities</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Find products with positive sentiment and growing popularity for higher conversion rates.
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('visualization')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'visualization'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Trend Visualization
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Actionable Insights
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {activeTab === 'visualization' ? (
        <TrendVisualization />
      ) : (
        <TrendInsights />
      )}
    </div>
  );
}
