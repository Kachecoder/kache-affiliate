/**
 * Competitor Visualization Component
 * 
 * This component provides visualizations for competitor data
 * including competitor profiles, strategies, and performance metrics.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { competitorAnalysisService } from '../../services/competitors/competitor-analysis-service';
import { Card, Button } from '../../lib/ui-components';

const CompetitorVisualization = () => {
  const { state, actions } = useData();
  
  // State for competitor data
  const [competitorData, setCompetitorData] = useState({
    competitors: {},
    strategies: {},
    content: {},
    performance: {},
    niches: {}
  });
  
  // State for UI
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  // Load competitor data
  useEffect(() => {
    const loadCompetitorData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize competitor analysis service
        await competitorAnalysisService.initialize();
        
        // Get competitor data
        setCompetitorData(competitorAnalysisService.competitorData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load competitor data:', error);
        setError('Failed to load competitor data: ' + error.message);
        setIsLoading(false);
      }
    };
    
    loadCompetitorData();
  }, []);
  
  // Analyze data for competitor insights
  const analyzeData = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Analyze all data for competitor insights
      const result = await competitorAnalysisService.analyzeAllData();
      
      if (result.success) {
        // Update competitor data
        setCompetitorData(result.competitors);
      } else {
        setError(result.message);
      }
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Failed to analyze data for competitor insights:', error);
      setError('Failed to analyze data for competitor insights: ' + error.message);
      setIsAnalyzing(false);
    }
  };
  
  // Get competitors filtered by niche
  const getFilteredCompetitors = () => {
    const allCompetitors = Object.values(competitorData.competitors || {});
    
    if (selectedNiche === 'all') {
      return allCompetitors;
    }
    
    return allCompetitors.filter(competitor => competitor.niche === selectedNiche);
  };
  
  // Get top competitors
  const getTopCompetitors = () => {
    const competitors = getFilteredCompetitors();
    
    // Sort by performance score if available
    if (competitorData.performance) {
      return competitors
        .filter(competitor => competitorData.performance[competitor.id])
        .sort((a, b) => 
          competitorData.performance[b.id].score - 
          competitorData.performance[a.id].score
        )
        .slice(0, 5);
    }
    
    // Otherwise sort by followers
    return competitors
      .sort((a, b) => 
        (b.metrics?.followers || 0) - (a.metrics?.followers || 0)
      )
      .slice(0, 5);
  };
  
  // Get niche analysis
  const getNicheAnalysis = (niche) => {
    if (niche === 'all') {
      return null;
    }
    
    return competitorData.niches?.[niche] || null;
  };
  
  // Get competitive gap analysis
  const getCompetitiveGapAnalysis = () => {
    return competitorAnalysisService.getCompetitiveGapAnalysis();
  };
  
  // Render performance score
  const renderPerformanceScore = (score) => {
    let color = 'gray';
    
    if (score >= 80) color = 'green';
    else if (score >= 60) color = 'blue';
    else if (score >= 40) color = 'yellow';
    else if (score >= 20) color = 'orange';
    else color = 'red';
    
    return (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
          <div 
            className={`bg-${color}-600 h-2.5 rounded-full`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium">{score}</span>
      </div>
    );
  };
  
  // Render opportunity level badge
  const renderOpportunityBadge = (level) => {
    const colors = {
      high: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Competitor Analysis</h2>
        <Button onClick={analyzeData} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {/* Niche Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Niche:
          </label>
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
      </Card>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading competitor data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Competitive Gap Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Competitive Gap Analysis</h3>
            
            <div className="space-y-4">
              {selectedNiche === 'all' ? (
                // Show all niches
                Object.entries(getCompetitiveGapAnalysis()).map(([niche, analysis]) => (
                  <div key={niche} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{niche}</h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {analysis.competitorCount} competitors identified
                        </p>
                      </div>
                      <div>
                        {renderOpportunityBadge(analysis.opportunityLevel)}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {analysis.recommendation}
                    </p>
                    {analysis.contentGaps.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Gaps:</h5>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {analysis.contentGaps.slice(0, 5).map((gap, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {gap}
                            </span>
                          ))}
                          {analysis.contentGaps.length > 5 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                              +{analysis.contentGaps.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Show selected niche
                (() => {
                  const analysis = getCompetitiveGapAnalysis()[selectedNiche];
                  
                  if (!analysis) {
                    return (
                      <p className="text-gray-500 dark:text-gray-400">
                        No gap analysis available for this niche. Click "Analyze Data" to generate insights.
                      </p>
                    );
                  }
                  
                  return (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{selectedNiche}</h4>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {analysis.competitorCount} competitors identified
                          </p>
                        </div>
                        <div>
                          {renderOpportunityBadge(analysis.opportunityLevel)}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {analysis.recommendation}
                      </p>
                      {analysis.contentGaps.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Gaps:</h5>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {analysis.contentGaps.map((gap, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {gap}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </Card>
          
          {/* Top Competitors */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Competitors</h3>
            
            {getTopCompetitors().length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No competitors identified yet. Click "Analyze Data" to find competitors.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Competitor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Platform
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Niche
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Audience
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Performance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {getTopCompetitors().map((competitor) => (
                      <tr key={competitor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {competitor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {competitor.platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {competitor.niche}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {competitor.metrics?.followers ? competitor.metrics.followers.toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {competitorData.performance?.[competitor.id] ? (
                            renderPerformanceScore(competitorData.performance[competitor.id].score)
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <button
                            onClick={() => setSelectedCompetitor(competitor.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          
          {/* Competitor Details */}
          {selectedCompetitor && competitorData.competitors[selectedCompetitor] && (
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Competitor Details</h3>
                <button
                  onClick={() => setSelectedCompetitor(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
 <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>