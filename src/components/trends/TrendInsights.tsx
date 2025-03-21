/**
 * Trend Insights Component
 * 
 * This component provides actionable insights based on trend analysis
 * to help users make data-driven decisions for their affiliate marketing campaigns.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import * as trendAnalysisService from '../../services/trends/trend-analysis-service';
import { Card } from '../../lib/ui-components';

const TrendInsights = () => {
  const { state, actions }: { state: any; actions: any } = useData();
  
  // State for insights
  const [insights, setInsights] = useState<{ type: string; title: string; description: string; action: string; priority: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate insights based on trend data
  useEffect(() => {
    const generateInsights = async () => {
      try {
        setIsLoading(true);
        
        // Initialize trend analysis service if not already initialized
        if (!trendAnalysisService.initialized) {
          await trendAnalysisService.initialize();
        }
        
        // Get top trending niches, keywords, and products
        const topNiches = trendAnalysisService.getTopTrendingNiches(5);
        const topKeywords = trendAnalysisService.getTopTrendingKeywords(10);
        const topProducts = trendAnalysisService.getTopTrendingProducts(10);
        
        // Generate predictions
        const predictionsResult = await trendAnalysisService.getTrendPredictions();
        const predictions = predictionsResult.success ? predictionsResult.predictions : null;
        
        // Generate insights
        const generatedInsights = [];
        
        // Niche insights
        if (topNiches.length > 0) {
          const topNiche = topNiches[0];
          generatedInsights.push({
            type: 'niche',
            title: `Focus on ${topNiche.niche}`,
            description: `This niche is showing the strongest growth (${topNiche.growth.toFixed(1)}%) among your target markets. Consider allocating more resources to this area.`,
            action: 'Develop content and campaigns specifically for this niche.',
            priority: 'high'
          });
        }
        
        // Keyword insights
        if (topKeywords.length > 0) {
          const topKeyword = topKeywords[0];
          generatedInsights.push({
            type: 'keyword',
            title: `Target "${topKeyword.keyword}" in your content`,
            description: `This keyword has ${topKeyword.mentions} mentions and a ${topKeyword.sentiment > 0 ? 'positive' : topKeyword.sentiment < 0 ? 'negative' : 'neutral'} sentiment of ${topKeyword.sentiment.toFixed(2)}.`,
            action: 'Create content around this keyword to capture trending interest.',
            priority: 'medium'
          });
        }
        
        // Product insights
        if (topProducts.length > 0) {
          const topProduct = topProducts[0];
          generatedInsights.push({
            type: 'product',
            title: `Promote ${topProduct.title}`,
            description: `This product has ${topProduct.mentions} mentions and a ${topProduct.sentiment > 0 ? 'positive' : topProduct.sentiment < 0 ? 'negative' : 'neutral'} sentiment of ${topProduct.sentiment.toFixed(2)}.`,
            action: 'Create review content and affiliate links for this product.',
            priority: 'medium'
          });
        }
        
        // Budget allocation insights
        generatedInsights.push({
          type: 'budget',
          title: 'Optimize Your $20 Budget',
          description: 'With your limited initial budget, focus on organic content creation for the top trending keywords rather than paid advertising.',
          action: 'Create high-quality content for Pinterest and TikTok targeting the top keywords.',
          priority: 'high'
        });
        
        // Growth strategy insights
        if (predictions && predictions.overall.nextMonth.topNiches.length > 0) {
          const futureNiche = predictions.overall.nextMonth.topNiches[0];
          generatedInsights.push({
            type: 'growth',
            title: 'Prepare for Future Trends',
            description: `${futureNiche.niche} is predicted to grow by ${futureNiche.predictedGrowth.toFixed(1)}% next month. Start developing content now to capitalize on this trend.`,
            action: 'Research and prepare content for this upcoming trend.',
            priority: 'medium'
          });
        }
        
        // Income goal insights
        generatedInsights.push({
          type: 'income',
          title: 'Path to $10,000 Monthly Income',
          description: 'Based on current trends, focus on high-commission products in the top niches to maximize revenue potential.',
          action: 'Identify products with commission rates of 10% or higher in your top niches.',
          priority: 'high'
        });
        
        setInsights(generatedInsights);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to generate insights:', error);
        setError('Failed to generate insights: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setIsLoading(false);
      }
    };
    
    generateInsights();
  }, []);
  
  // Render priority badge
  const renderPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };
  
  // Render type icon
  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'niche':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        );
      case 'keyword':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-secondary-600 dark:text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        );
      case 'product':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      case 'budget':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'growth':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'income':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Actionable Insights</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Generating insights...</p>
        </div>
      ) : insights.length === 0 ? (
        <Card className="p-6">
          <p className="text-gray-500 dark:text-gray-400">
            No insights available yet. Analyze your data to generate insights.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={index} className="p-6">
              <div className="flex space-x-4">
                {renderTypeIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                    {renderPriorityBadge(insight.priority)}
                  </div>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{insight.description}</p>
                  <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recommended Action:</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{insight.action}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendInsights;
