/**
 * Updated Scraping Page with Results Component
 * 
 * This page provides the user interface for configuring, managing,
 * and viewing results of data scraping operations.
 */

import React, { useState } from 'react';
import ScraperConfig from '../components/scraper/ScraperConfig';
import ScraperResults from '../components/scraper/ScraperResults';

export default function ScrapingPage() {
  const [activeTab, setActiveTab] = useState('config');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Scraping</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Configure and manage data scraping operations to gather information about products, trends, and competitors.
          This data will be used to generate marketing strategies and optimize your affiliate campaigns.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Social Media</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Scrape data from Twitter, Pinterest, and TikTok to identify trending topics and influencer strategies.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Affiliate Networks</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gather product information and commission rates from Amazon, Clickbank, and ShareASale.
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium">Custom Websites</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Extract data from any website to research competitors and identify market opportunities.
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'config'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Results
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {activeTab === 'config' ? (
        <ScraperConfig />
      ) : (
        <ScraperResults />
      )}
    </div>
  );
}
