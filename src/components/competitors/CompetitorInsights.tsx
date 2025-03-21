/**
 * Competitor Insights Component
 * 
 * This component provides actionable insights based on competitor analysis
 * to help users develop strategies to compete effectively.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import * as competitorAnalysisService from '../../services/competitors/competitor-analysis-service';
import { Card, Button } from '../../lib/ui-components';

const CompetitorInsights = () => {
  const { state } = useData();
  
  // State for insights
  const [insights, setInsights] = useState([]);
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Generate insights based on competitor data
  useEffect(() => {
    const generateInsights = async () => {
      try {
        setIsLoading(true);
        
        // Initialize competitor analysis service if not already initialized
        if (!competitorAnalysisService.initialized) {
          await competitorAnalysisService.initialize();
        }
        
        // Generate insights
        const generatedInsights = [];
        
        // Get competitive gap analysis
        const gapAnalysis = competitorAnalysisService.getCompetitiveGapAnalysis();
        
        // Get top competitors
        const topCompetitors = competitorAnalysisService.getTopCompetitors(5);
        
        // Get all niche analyses
        const nicheAnalyses = competitorAnalysisService.getAllNicheAnalyses();
        
        // Generate niche-specific insights
        Object.entries(gapAnalysis).forEach(([niche, analysis]) => {
          if (selectedNiche !== 'all' && selectedNiche !== niche) {
            return;
          }
          
          // Opportunity insight
          generatedInsights.push({
            type: 'opportunity',
            niche,
            title: `${niche} Opportunity: ${analysis.opportunityLevel.toUpperCase()}`,
            description: analysis.recommendation,
            action: `Focus on ${analysis.contentGaps.slice(0, 3).join(', ')} content to fill gaps in this niche.`,
            priority: analysis.opportunityLevel === 'high' ? 'high' : analysis.opportunityLevel === 'medium' ? 'medium' : 'low'
          });
          
          // Content gap insight
          if (analysis.contentGaps.length > 0) {
            generatedInsights.push({
              type: 'content_gap',
              niche,
              title: `Content Opportunity in ${niche}`,
              description: `There are ${analysis.contentGaps.length} content topics that competitors aren't covering well.`,
              action: `Create content around ${analysis.contentGaps.slice(0, 3).join(', ')} to stand out.`,
              priority: 'medium'
            });
          }
          
          // Common strategies insight
          const nicheAnalysis = nicheAnalyses[niche];
          if (nicheAnalysis && nicheAnalysis.commonStrategies && nicheAnalysis.commonStrategies.length > 0) {
            generatedInsights.push({
              type: 'strategy',
              niche,
              title: `Common Strategies in ${niche}`,
              description: `${nicheAnalysis.commonStrategies.length} common strategies identified among competitors.`,
              action: `Consider adopting ${nicheAnalysis.commonStrategies[0].description} to match industry standards.`,
              priority: 'medium'
            });
          }
        });
        
        // Generate competitor-specific insights
        topCompetitors.forEach(competitor => {
          if (selectedNiche !== 'all' && selectedNiche !== competitor.niche) {
            return;
          }
          
          // Top competitor insight
          if (competitor.performanceScore >= 70) {
            generatedInsights.push({
              type: 'top_competitor',
              niche: competitor.niche,
              title: `Learn from ${competitor.name}`,
              description: `This top performer (score: ${competitor.performanceScore}) in ${competitor.niche} is worth studying.`,
              action: `Analyze their content and engagement strategies on ${competitor.platform}.`,
              priority: 'high'
            });
          }
        });
        
        // Budget allocation insight
        generatedInsights.push({
          type: 'budget',
          niche: 'all',
          title: 'Optimize Your $20 Budget',
          description: 'With your limited initial budget, focus on content gaps that competitors aren\'t addressing.',
          action: 'Create unique content for the identified gaps rather than competing directly with established competitors.',
          priority: 'high'
        });
        
        // Platform strategy insight
        generatedInsights.push({
          type: 'platform',
          niche: 'all',
          title: 'Platform Strategy',
          description: 'Based on competitor analysis, some platforms have less competition in your target niches.',
          action: 'Focus on Pinterest for DIY & Home Improvement and TikTok for AI & Automation Tools to maximize impact.',
          priority: 'medium'
        });
        
        // Income goal insight
        generatedInsights.push({
          type: 'income',
          niche: 'all',
          title: 'Path to $10,000 Monthly Income',
          description: 'To reach your income goal, focus on niches with high opportunity scores and fewer established competitors.',
          action: 'Prioritize content creation for niches with "High" opportunity levels in the gap analysis.',
          priority: 'high'
        });
        
        // Filter insights based on selected niche
        const filteredInsights = selectedNiche === 'all' 
          ? generatedInsights 
          : generatedInsights.filter(insight => insight.niche === 'all' || insight.niche === selectedNiche);
        
        setInsights(filteredInsights);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to generate insights:', error);
        setError('Failed to generate insights: ' + error.message);
        setIsLoading(false);
      }
    };
    
    generateInsights();
  }, [selectedNiche]);
  
  // Render priority badge
  const renderPriorityBadge = (priority) => {
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
  const renderTypeIcon = (type) => {
    switch (type) {
      case 'opportunity':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'content_gap':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'strategy':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'top_competitor':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'budget':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'platform':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-pink-600 dark:text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'income':
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Competitive Insights</h2>
        
        <select
          value={selectedNiche}
          onChange={(e) => setSelectedNiche(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All Niches</option>
          {state.preferences.niches.map((niche, index) => (
            <option key={index} value={niche}>
              {niche}
            </option>
          ))}
        </select>
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

export default CompetitorInsights;
