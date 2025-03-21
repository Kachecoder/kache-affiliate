/**
 * Scraper Results Component
 * 
 * This component displays the results of data scraping operations
 * and provides tools for analyzing and exporting the data.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import dataStorage from '../../services/scraper/data-storage'; // Ensure this module exists and is correctly typed
import { Card, Button } from '../../lib/ui-components'; // Ensure these components are correctly imported

const ScraperResults = () => {
  const { state, actions } = useData() as { state: any; actions: any };
  
  // State for results data
  const [resultsData, setResultsData] = useState({
    socialMedia: [],
    affiliateNetworks: [],
    websites: []
  });
  
  // State for filtering and display options
  const [filter, setFilter] = useState({
    category: 'all',
    source: 'all',
    keyword: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get all data from storage
        const socialMediaData = dataStorage.getCategoryData('socialMedia');
        const affiliateNetworksData = dataStorage.getCategoryData('affiliateNetworks');
        const websitesData = dataStorage.getCategoryData('websites');
        
        // Convert objects to arrays
        const socialMediaArray = Object.values(socialMediaData);
        const affiliateNetworksArray = Object.values(affiliateNetworksData);
        const websitesArray = Object.values(websitesData);
        
        setResultsData({
          socialMedia: socialMediaArray as any[],
          affiliateNetworks: affiliateNetworksArray as any[],
          websites: websitesArray as any[]
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load data: ' + (error as Error).message);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (field: keyof typeof filter, value: string) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      [field]: value
    }));
  };
  
  // Apply filters to get filtered data
  const getFilteredData = () => {
    let filteredData: any[] = [];
    
    // Combine data based on category filter
    if (filter.category === 'all' || filter.category === 'socialMedia') {
      filteredData = [...filteredData, ...resultsData.socialMedia];
    }
    
    if (filter.category === 'all' || filter.category === 'affiliateNetworks') {
      filteredData = [...filteredData, ...resultsData.affiliateNetworks];
    }
    
    if (filter.category === 'all' || filter.category === 'websites') {
      filteredData = [...filteredData, ...resultsData.websites];
    }
    
    // Filter by source
    if (filter.source !== 'all') {
      filteredData = filteredData.filter(item => item.source === filter.source);
    }
    
    // Filter by keyword
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      filteredData = filteredData.filter(item => {
        // Check if keyword is in the query
        if (item.data.query && item.data.query.toLowerCase().includes(keyword)) {
          return true;
        }
        
        // Check if keyword is in the results (simplified)
        if (item.data.results) {
          return JSON.stringify(item.data.results).toLowerCase().includes(keyword);
        }
        
        return false;
      });
    }
    
    // Filter by date range
    if (filter.dateFrom || filter.dateTo) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.timestamp);
        
        if (filter.dateFrom && filter.dateTo) {
          const from = new Date(filter.dateFrom);
          const to = new Date(filter.dateTo);
          return itemDate >= from && itemDate <= to;
        } else if (filter.dateFrom) {
          const from = new Date(filter.dateFrom);
          return itemDate >= from;
        } else if (filter.dateTo) {
          const to = new Date(filter.dateTo);
          return itemDate <= to;
        }
        
        return true;
      });
    }
    
    return filteredData;
  };
  
  // Get filtered data
  const filteredData = getFilteredData();
  
  // Export data as JSON
  const exportData = () => {
    try {
      const dataToExport = filteredData;
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `affiliate-data-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Failed to export data:', error);
      setError('Failed to export data: ' + (error as Error).message);
    }
  };
  
  // Delete a result
  const deleteResult = (id: string) => {
    try {
      const success = dataStorage.deleteData(id);
      
      if (success) {
        // Refresh data
        const socialMediaData = dataStorage.getCategoryData('socialMedia');
        const affiliateNetworksData = dataStorage.getCategoryData('affiliateNetworks');
        const websitesData = dataStorage.getCategoryData('websites');
        
        // Convert objects to arrays
        const socialMediaArray = Object.values(socialMediaData);
        const affiliateNetworksArray = Object.values(affiliateNetworksData);
        const websitesArray = Object.values(websitesData);
        
        setResultsData({
          socialMedia: socialMediaArray,
          affiliateNetworks: affiliateNetworksArray,
          websites: websitesArray
        });
      } else {
        setError('Failed to delete result: Result not found' as any);
      }
    } catch (error) {
      console.error('Failed to delete result:', error);
      setError('Failed to delete result: ' + (error as Error).message);
    }
  };
  
  // Render a result item
  const renderResultItem = (item: { id: string; category: string; source: string; timestamp: string; data: any }) => {
    const { id, category, source, timestamp, data } = item;
    const date = new Date(timestamp).toLocaleString();
    
    return (
      <div key={id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{source}</span>
              {data.query && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">→</span>
                  <span>{data.query}</span>
                </>
              )}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Collected: {date}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => deleteResult(id)}>
              Delete
            </Button>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm">
            <div className="font-medium">Results:</div>
            <div className="mt-1 text-gray-500 dark:text-gray-400">
              {data.results && Array.isArray(data.results) ? (
                `Found ${data.results.length} items`
              ) : (
                'Data available'
              )}
            </div>
          </div>
          
          {/* Preview of results */}
          <div className="mt-2 bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto">
            {JSON.stringify(data.results ? data.results.slice(0, 2) : data, null, 2)}
            {data.results && data.results.length > 2 && (
              <div className="mt-1 text-gray-500 dark:text-gray-400">
                ... and {data.results.length - 2} more items
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scraping Results</h2>
        <Button onClick={exportData} disabled={filteredData.length === 0}>
          Export Data
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Filter Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="socialMedia">Social Media</option>
              <option value="affiliateNetworks">Affiliate Networks</option>
              <option value="websites">Websites</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source
            </label>
            <select
              value={filter.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Sources</option>
              <option value="twitter">Twitter</option>
              <option value="pinterest">Pinterest</option>
              <option value="tiktok">TikTok</option>
              <option value="amazon">Amazon</option>
              <option value="clickbank">Clickbank</option>
              <option value="shareasale">ShareASale</option>
              <option value="custom">Custom Website</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keyword
            </label>
            <input
              type="text"
              value={filter.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              placeholder="Filter by keyword"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From
              </label>
              <input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <input
                type="date"
                value={filter.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Results ({filteredData.length})</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading results...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No results found. Try adjusting your filters or run some scraping tasks.</p>
          </div>
        ) : (
          <div>
            {filteredData.map(renderResultItem)}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ScraperResults;
