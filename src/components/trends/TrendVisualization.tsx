/**
 * Trend Visualization Component
 * 
 * This component provides visualizations for trend data
 * including charts, graphs, and trend indicators.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import * as trendAnalysisService from '../../services/trends/trend-analysis-service';
import { Card, Button } from '../../lib/ui-components';

const TrendVisualization = () => {
  const { state, actions }: { state: any; actions: any } = useData();
  
  // State for trend data
  const [trendData, setTrendData] = useState({
    niches: {},
    keywords: {},
    products: {},
    timeframes: {
      daily: {},
      weekly: {},
      monthly: {}
    }
  });
  
  // State for predictions
  const [predictions, setPredictions] = useState({
    niches: {},
    keywords: {},
    overall: {
      nextMonth: {
        topNiches: [],
        topKeywords: [],
        topProducts: [],
        sentiment: 0
      }
    }
  });
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  // Load trend data
  useEffect(() => {
    const loadTrendData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize trend analysis service
        await trendAnalysisService.initialize();
        
        // Get trend data
        setTrendData(trendAnalysisService.trendData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load trend data:', error);
        setError('Failed to load trend data: ' + (error as Error).message);
        setIsLoading(false);
      }
    };
    
    loadTrendData();
  }, []);
  
  // Analyze data for trends
  const analyzeData = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Analyze all data for trends
      const result = await trendAnalysisService.analyzeAllData();
      
      if (result.success) {
        // Update trend data
        setTrendData(result.trends);
        
        // Generate predictions
        const predictionsResult = await trendAnalysisService.getTrendPredictions();
        
        if (predictionsResult.success) {
          setPredictions(predictionsResult.predictions);
        } else {
          setError(predictionsResult.message);
        }
      } else {
        setError(result.message);
      }
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Failed to analyze data for trends:', error);
      setError('Failed to analyze data for trends: ' + (error as Error).message);
      setIsAnalyzing(false);
    }
  };
  
  // Get top trending niches
  const getTopTrendingNiches = () => {
    return trendAnalysisService.getTopTrendingNiches(5);
  };
  
  // Get top trending keywords
  const getTopTrendingKeywords = () => {
    return trendAnalysisService.getTopTrendingKeywords(10);
  };
  
  // Get top trending products
  const getTopTrendingProducts = () => {
    return trendAnalysisService.getTopTrendingProducts(10);
  };
  
  // Render trend indicator (up, down, or neutral)
  const renderTrendIndicator = (value: number) => {
    if (value > 0) {
      return (
        <span className="text-green-600 dark:text-green-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {value.toFixed(1)}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {Math.abs(value).toFixed(1)}%
        </span>
      );
    } else {
      return (
        <span className="text-gray-600 dark:text-gray-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
          0%
        </span>
      );
    }
  };
  
  // Render sentiment indicator
  const renderSentimentIndicator = (value: number) => {
    let color = 'gray';
    let label = 'Neutral';
    
    if (value > 0.5) {
      color = 'green';
      label = 'Very Positive';
    } else if (value > 0.1) {
      color = 'green';
      label = 'Positive';
    } else if (value < -0.5) {
      color = 'red';
      label = 'Very Negative';
    } else if (value < -0.1) {
      color = 'red';
      label = 'Negative';
    }
    
    return (
      <span className={`text-${color}-600 dark:text-${color}-400`}>
        {label} ({value.toFixed(2)})
      </span>
    );
  };
  
  return (
    <div className="space-y-6"></div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trend Analysis</h2>
        <Button onClick={analyzeData} disabled={isAnalyzing} className="">
          {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading trend data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Niche Trends */}
          <Card className="p-6"></Card>
            <h3 className="text-lg font-semibold mb-4">Niche Trends</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Niche
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Popularity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Growth
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Predicted Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {getTopTrendingNiches().map((niche: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {niche.niche}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {niche.popularity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {renderTrendIndicator(niche.growth || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {predictions.niches[niche.niche] ? (
                          renderTrendIndicator(predictions.niches[niche.niche].predictedGrowth || 0)
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {getTopTrendingNiches().length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No niche trend data available. Click "Analyze Data" to generate trends.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Keyword Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Keyword Trends</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Keyword
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mentions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sentiment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Predicted Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {getTopTrendingKeywords().map((keyword: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {keyword.keyword}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {keyword.mentions || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {renderSentimentIndicator(keyword.sentiment || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {predictions.keywords[keyword.keyword] ? (
                          renderTrendIndicator(predictions.keywords[keyword.keyword].predictedGrowth || 0)
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {getTopTrendingKeywords().length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No keyword trend data available. Click "Analyze Data" to generate trends.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Product Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Trends</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mentions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sentiment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {getTopTrendingProducts().map((product: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${product.price?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {product.mentions || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {renderSentimentIndicator(product.sentiment || 0)}
                      </td>
                    </tr>
                  ))}
                  
                  {getTopTrendingProducts().length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No product trend data available. Click "Analyze Data" to generate trends.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Predictions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trend Predictions</h3>
            
            {predictions.overall.nextMonth.topNiches.length > 0 ? (
              <div className="space-y-4"></div>
                <div></div>
                  <h4 className="text-md font-medium mb-2">Top Niches for Next Month</h4>
                  <ul className="space-y-2"></ul>
                    {predictions.overall.nextMonth.topNiches.map((niche, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{niche.niche}</span>
                        <span className="text-sm">
                          {renderTrendIndicator(niche.predictedGrowth || 0)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Top Keywords for Next Month</h4>
                  <ul className="space-y-2">
                    {predictions.overall.nextMonth.topKeywords.map((keyword, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{keyword.keyword}</span>
                        <span className="text-sm">
                          {renderTrendIndicator(keyword.predictedGrowth || 0)}
                        </span>
                      </li>
                    ))}
              <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>