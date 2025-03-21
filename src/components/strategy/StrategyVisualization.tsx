/**
 * Strategy Visualization Component
 * 
 * This component provides visualizations for marketing strategies
 * including content, platform, product, budget, and timeline strategies.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import * as marketingStrategyService from '../../services/strategy/marketing-strategy-service';
import { Card, Button } from '../../lib/ui-components';

const StrategyVisualization = () => {
  const { state, actions }: { state: any; actions: any } = useData();
  
  // State for strategy data
  const [strategyData, setStrategyData] = useState({
    content: [],
    platform: [],
    product: [],
    budget: [],
    timeline: []
  });
  
  // State for strategy options
  const [strategyOptions, setStrategyOptions] = useState({
    budget: 20,
    timeframe: 90,
    platforms: ['pinterest', 'tiktok', 'twitter'],
    focusNiches: state.preferences.niches || [],
    contentTypes: ['blog', 'social', 'video'],
    goalIncome: 10000,
    weeklyHours: 25
  });
  
  // State for UI
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState('content');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // Load strategy data
  useEffect(() => {
    const loadStrategyData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize marketing strategy service
        await marketingStrategyService.initialize();
        
        // Check if we have any strategy data
        if (Object.values(marketingStrategyService.strategies).some((arr: any[]) => arr.length > 0)) {
          setStrategyData(marketingStrategyService.strategies);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load strategy data:', error);
        setError('Failed to load strategy data: ' + (error as Error).message);
        setIsLoading(false);
      }
    };
    
    loadStrategyData();
  }, []);
  
  // Generate marketing strategy
  const generateStrategy = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Generate strategy with current options
      const result = await marketingStrategyService.generateStrategy(strategyOptions);
      
      if (result.success) {
        // Update strategy data
        setStrategyData(result.strategies);
      } else {
        setError(result.message);
      }
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Failed to generate marketing strategy:', error);
      setError('Failed to generate marketing strategy: ' + (error as Error).message);
      setIsGenerating(false);
    }
  };
  
  // Handle option change
  const handleOptionChange = (option: string, value: any) => {
    setStrategyOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // Get filtered strategy data
  const getFilteredStrategyData = () => {
    if (selectedNiche === 'all') {
      return strategyData[selectedStrategy as keyof typeof strategyData];
    }
    
    return strategyData[selectedStrategy].filter(strategy => 
      strategy.niche === selectedNiche
    );
  };
  
  // Render content strategy
  const renderContentStrategy = (strategy: any) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{strategy.niche}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Priority: {strategy.priority}
          </span>
        </div>
        
        {/* Content Ideas */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Content Ideas</h4>
          <div className="space-y-2">
            {strategy.contentIdeas.slice(0, 5).map((idea: any, index: number) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-900 dark:text-white">{idea.title}</div>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2.5 py-0.5 rounded-full">
                    {idea.type}
                  </span>
                </div>
                {idea.isContentGap && (
                  <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                    Content Gap
                  </span>
                )}
              </div>
            ))}
            {strategy.contentIdeas.length > 5 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +{strategy.contentIdeas.length - 5} more content ideas
              </p>
            )}
          </div>
        </div>
        
        {/* Keyword Strategy */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Keyword Strategy</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Keywords:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {strategy.keywordStrategy.primaryKeywords.map((keyword: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Keywords:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {strategy.keywordStrategy.secondaryKeywords.slice(0, 5).map((keyword: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Schedule */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Content Schedule</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">Weekly Posts:</span>
              <span className="font-medium text-gray-900 dark:text-white">{strategy.contentSchedule.weeklyPosts}</span>
            </div>
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Recommended Days:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {strategy.contentSchedule.recommendedDays.map((day: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Content Mix:</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {Object.entries(strategy.contentSchedule.contentMix)
                  .filter(([_, count]: [string, number]) => count > 0)
                  .map(([type, count], index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{type}:</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{count as number} per week</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render platform strategy
  const renderPlatformStrategy = (strategy: any) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{strategy.niche}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Primary Platform: {strategy.primaryPlatform?.platform}
          </span>
        </div>
        
        {/* Platform Rankings */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Platform Rankings</h4>
          <div className="space-y-2">
            {strategy.platforms.map((platform: any, index: number) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-900 dark:text-white">{platform.platform}</div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Effectiveness:</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(platform.effectiveness / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{platform.effectiveness}/10</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recommended Content:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {platform.contentTypes.map((type: string, typeIndex: number) => (
                      <span key={typeIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posting Frequency:</span>
                  <div className="text-sm text-gray-900 dark:text-white mt-1">
                    {platform.postingFrequency.postsPerWeek} posts per week
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cross-Platform Strategy */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Cross-Platform Strategy</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Repurposing:</span>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                {strategy.crossPlatformStrategy.contentRepurposing.slice(0, 3).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cross Promotion:</span>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                {strategy.crossPlatformStrategy.crossPromotion.slice(0, 3).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render product strategy
  const renderProductStrategy = (strategy: any) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{strategy.niche}</h3>
        </div>
        
        {/* Recommended Products */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Recommended Products</h4>
          <div className="space-y-2">
            {strategy.recommendedProducts.length > 0 ? (
              strategy.recommendedProducts.map((product: any, index: number) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="font-medium text-gray-900 dark:text-white">{product.title}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Price: ${product.price?.toFixed(2) || 'N/A'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Mentions: {product.mentions || 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No product recommendations available yet.
              </p>
            )}
          </div>
        </div>
        
        {/* Promotion Strategy */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Promotion Strategy</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Types:</span>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                {strategy.promotionStrategy.contentTypes.slice(0, 3).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Promotion Tactics:</span>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                {strategy.promotionStrategy.promotionTactics.slice(0, 3).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Affiliate Networks */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Recommended Affiliate Networks</h4>
          <div className="space-y-2">
            {strategy.affiliateNetworks.slice(0, 3).map((network: any, index: number) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-900 dark:text-white">{network.name}</div>
                  <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2.5 py-0.5 rounded-full">
                    {network.commissionRange}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Pros:</span>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {network.pros.slice(0, 2).map((pro: string, proIndex: number) => (
                        <li key={proIndex}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>