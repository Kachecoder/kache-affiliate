/**
 * Competitors Page
 * 
 * This page provides the user interface for analyzing competitors
 * and gaining insights to develop effective marketing strategies.
 */

import React, { useState } from 'react';
import CompetitorVisualization from '../components/competitors/CompetitorVisualization';
import CompetitorInsights from '../components/competitors/CompetitorInsights';

export default function CompetitorsPage() {
  const [activeTab, setActiveTab] = useState('visualization');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Competitor Analysis</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Analyze your competitors to identify their strategies, strengths, and weaknesses.
          Use these insights to develop effective marketing campaigns that stand out in your target niches.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Competitor Profiles</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Identify top competitors in your niches and analyze their performance metrics.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Strategy Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Discover what strategies are working for successful competitors in your space.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Gap Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Find content and market gaps that you can exploit with your limited budget.
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
            Competitor Analysis
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Competitive Insights
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {activeTab === 'visualization' ? (
        <CompetitorVisualization />
      ) : (
        <CompetitorInsights />
      )}
    </div>
  );
}
