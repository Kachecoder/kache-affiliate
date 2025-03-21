/**
 * Trend Analysis Service
 * 
 * This service provides functionality to analyze data for trends
 * in affiliate marketing niches, products, and keywords.
 */

import * as tf from '@tensorflow/tfjs';
import dataStorage from '../scraper/data-storage';

// Main trend analysis class
class TrendAnalysisService {
  constructor() {
    this.trendData = {
      niches: {},
      keywords: {},
      products: {},
      timeframes: {
        daily: {},
        weekly: {},
        monthly: {}
      }
    };
    
    this.preferredNiches = [
      "Survival & Emergency Preparedness",
      "DIY & Home Improvement",
      "Personal Finance & Making Money Online",
      "E-Learning & Skill-Building",
      "AI & Automation Tools"
    ];
    
    this.initialized = false;
  }
  
  // Initialize the trend analysis service
  async initialize() {
    try {
      console.log('Initializing trend analysis service');
      
      // Load any saved trend data
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTrendData = localStorage.getItem('kache_affiliate_trends');
        if (savedTrendData) {
          this.trendData = JSON.parse(savedTrendData);
          console.log('Loaded trend data from localStorage');
        }
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize trend analysis service:', error);
      return false;
    }
  }
  
  // Save trend data to persistent storage
  saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('kache_affiliate_trends', JSON.stringify(this.trendData));
        console.log('Saved trend data to localStorage');
      }
      return true;
    } catch (error) {
      console.error('Failed to save trend data to storage:', error);
      return false;
    }
  }
  
  // Analyze all available data for trends
  async analyzeAllData() {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      console.log('Analyzing all data for trends');
      
      // Get all data from storage
      const allData = dataStorage.searchData();
      
      if (allData.length === 0) {
        return {
          success: false,
          message: 'No data available for analysis',
          trends: {}
        };
      }
      
      // Analyze by niche
      await this.analyzeByNiche(allData);
      
      // Analyze by keyword
      await this.analyzeByKeyword(allData);
      
      // Analyze by product
      await this.analyzeByProduct(allData);
      
      // Analyze by timeframe
      await this.analyzeByTimeframe(allData);
      
      // Save trend data
      this.saveToStorage();
      
      return {
        success: true,
        message: 'Successfully analyzed all data for trends',
        trends: this.trendData
      };
    } catch (error) {
      console.error('Failed to analyze all data for trends:', error);
      return {
        success: false,
        message: 'Failed to analyze all data for trends: ' + error.message,
        trends: {}
      };
    }
  }
  
  // Analyze data by niche
  async analyzeByNiche(data) {
    try {
      console.log('Analyzing data by niche');
      
      // Initialize niche data
      this.preferredNiches.forEach(niche => {
        if (!this.trendData.niches[niche]) {
          this.trendData.niches[niche] = {
            popularity: 0,
            growth: 0,
            keywords: [],
            products: [],
            lastUpdated: new Date().toISOString()
          };
        }
      });
      
      // Process each data item
      data.forEach(item => {
        // Skip if no results
        if (!item.data || !item.data.results) return;
        
        const results = item.data.results;
        const query = item.data.query || '';
        
        // Check which niche this data belongs to
        this.preferredNiches.forEach(niche => {
          const nicheKeywords = this.getNicheKeywords(niche);
          
          // Check if query or results contain niche keywords
          const matchesNiche = nicheKeywords.some(keyword => 
            query.toLowerCase().includes(keyword.toLowerCase()) ||
            JSON.stringify(results).toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (matchesNiche) {
            // Update niche data
            const nicheData = this.trendData.niches[niche];
            
            // Increment popularity
            nicheData.popularity += 1;
            
            // Extract keywords from results
            const extractedKeywords = this.extractKeywords(results);
            extractedKeywords.forEach(keyword => {
              if (!nicheData.keywords.includes(keyword)) {
                nicheData.keywords.push(keyword);
              }
            });
            
            // Extract products from results
            const extractedProducts = this.extractProducts(results);
            extractedProducts.forEach(product => {
              if (!nicheData.products.some(p => p.id === product.id)) {
                nicheData.products.push(product);
              }
            });
            
            // Update last updated timestamp
            nicheData.lastUpdated = new Date().toISOString();
          }
        });
      });
      
      // Calculate growth for each niche
      this.calculateNicheGrowth();
      
      return {
        success: true,
        message: 'Successfully analyzed data by niche',
        niches: this.trendData.niches
      };
    } catch (error) {
      console.error('Failed to analyze data by niche:', error);
      return {
        success: false,
        message: 'Failed to analyze data by niche: ' + error.message,
        niches: {}
      };
    }
  }
  
  // Get keywords associated with a niche
  getNicheKeywords(niche) {
    switch (niche) {
      case 'Survival & Emergency Preparedness':
        return [
          'survival', 'emergency', 'preparedness', 'prepping', 'disaster',
          'food storage', 'water filtration', 'solar generator', 'first aid',
          'emergency kit', 'bug out bag', 'survival gear'
        ];
      case 'DIY & Home Improvement':
        return [
          'diy', 'home improvement', 'tools', 'homesteading', 'woodworking',
          'gardening', 'home repair', 'power tools', 'hand tools', 'renovation',
          'home projects', 'building'
        ];
      case 'Personal Finance & Making Money Online':
        return [
          'personal finance', 'money', 'investing', 'budget', 'passive income',
          'side hustle', 'make money online', 'financial freedom', 'debt free',
          'retirement', 'stocks', 'real estate', 'cryptocurrency'
        ];
      case 'E-Learning & Skill-Building':
        return [
          'e-learning', 'online course', 'skill building', 'education', 'training',
          'coding', 'programming', 'bootcamp', 'certification', 'tutorial',
          'learn online', 'skills development'
        ];
      case 'AI & Automation Tools':
        return [
          'ai', 'artificial intelligence', 'automation', 'machine learning',
          'chatbot', 'ai writing', 'ai tools', 'automation software', 'workflow',
          'productivity tools', 'ai assistant', 'data analysis'
        ];
      default:
        return [];
    }
  }
  
  // Extract keywords from results
  extractKeywords(results) {
    try {
      // In a real implementation, this would use NLP techniques
      // For now, we'll use a simplified approach
      
      const keywords = [];
      const text = JSON.stringify(results);
      
      // Extract words and phrases
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3);
      
      // Count word frequency
      const wordCounts = {};
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
      
      // Get top keywords
      const topKeywords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
      
      return topKeywords;
    } catch (error) {
      console.error('Failed to extract keywords:', error);
      return [];
    }
  }
  
  // Extract products from results
  extractProducts(results) {
    try {
      const products = [];
      
      // Check if results is an array
      if (Array.isArray(results)) {
        results.forEach(result => {
          // Check if result has product-like properties
          if (result.title || result.name) {
            const product = {
              id: result.id || `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: result.title || result.name || 'Unknown Product',
              description: result.description || '',
              price: result.price || 0,
              url: result.url || result.link || '',
              image: result.image || '',
              source: result.source || 'unknown',
              timestamp: new Date().toISOString()
            };
            
            products.push(product);
          }
        });
      }
      
      return products;
    } catch (error) {
      console.error('Failed to extract products:', error);
      return [];
    }
  }
  
  // Calculate growth for each niche
  calculateNicheGrowth() {
    try {
      // In a real implementation, this would compare current data with historical data
      // For now, we'll use a simplified approach with random growth values
      
      Object.keys(this.trendData.niches).forEach(niche => {
        const nicheData = this.trendData.niches[niche];
        
        // Calculate growth based on popularity and random factor
        const randomFactor = Math.random() * 0.2 + 0.9; // 0.9 to 1.1
        const growth = (nicheData.popularity * randomFactor) - nicheData.popularity;
        
        nicheData.growth = parseFloat(growth.toFixed(2));
      });
      
      return true;
    } catch (error) {
      console.error('Failed to calculate niche growth:', error);
      return false;
    }
  }
  
  // Analyze data by keyword
  async analyzeByKeyword(data) {
    try {
      console.log('Analyzing data by keyword');
      
      // Process each data item
      data.forEach(item => {
        // Skip if no results or query
        if (!item.data || !item.data.results || !item.data.query) return;
        
        const query = item.data.query.toLowerCase();
        const results = item.data.results;
        
        // Initialize keyword data if not exists
        if (!this.trendData.keywords[query]) {
          this.trendData.keywords[query] = {
            mentions: 0,
            sentiment: 0,
            relatedKeywords: [],
            sources: [],
            lastUpdated: new Date().toISOString()
          };
        }
        
        const keywordData = this.trendData.keywords[query];
        
        // Increment mentions
        keywordData.mentions += 1;
        
        // Add source if not already added
        const source = item.source;
        if (!keywordData.sources.includes(source)) {
          keywordData.sources.push(source);
        }
        
        // Extract related keywords
        const relatedKeywords = this.extractKeywords(results);
        relatedKeywords.forEach(keyword => {
          if (keyword !== query && !keywordData.relatedKeywords.includes(keyword)) {
            keywordData.relatedKeywords.push(keyword);
          }
        });
        
        // Calculate sentiment
        keywordData.sentiment = this.calculateSentiment(results);
        
        // Update last updated timestamp
        keywordData.lastUpdated = new Date().toISOString();
      });
      
      return {
        success: true,
        message: 'Successfully analyzed data by keyword',
        keywords: this.trendData.keywords
      };
    } catch (error) {
      console.error('Failed to analyze data by keyword:', error);
      return {
        success: false,
        message: 'Failed to analyze data by keyword: ' + error.message,
        keywords: {}
      };
    }
  }
  
  // Calculate sentiment score for results
  calculateSentiment(results) {
    try {
      // In a real implementation, this would use NLP for sentiment analysis
      // For now, we'll use a simplified approach with positive and negative word lists
      
      const text = JSON.stringify(results).toLowerCase();
      
      const positiveWords = [
        'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic',
        'wonderful', 'best', 'love', 'perfect', 'recommend', 'positive',
        'happy', 'satisfied', 'quality', 'easy', 'helpful', 'valuable'
      ];
      
      const negativeWords = [
        'bad', 'poor', 'terrible', 'awful', 'horrible', 'worst',
        'hate', 'difficult', 'negative', 'problem', 'issue', 'disappointing',
        'waste', 'expensive', 'overpriced', 'avoid', 'broken', 'useless'
      ];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      // Count positive words
      positiveWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          positiveCount += matches.length;
        }
      });
      
      // Count negative words
      negativeWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          negativeCount += matches.length;
        }
      });
      
      // Calculate sentiment score (-1 to 1)
      const total = positiveCount + negativeCount;
      if (total === 0) return 0;
      
      const sentiment = (positiveCount - negativeCount) / total;
      return parseFloat(sentiment.toFixed(2));
    } catch (error) {
      console.error('Failed to calculate sentiment:', error);
      return 0;
    }
  }
  
  // Analyze data by product
  async analyzeByProduct(data) {
    try {
      console.log('Analyzing data by product');
      
      // Process each data item
      data.forEach(item => {
        // Skip if no results
        if (!item.data || !item.data.results) return;
        
        const results = item.data.results;
        
        // Extract products
        const products = this.extractProducts(results);
        
        // Process each product
        products.forEach(product => {
          const productId = product.id;
          
          // Initialize product data if not exists
          if (!this.trendData.products[productId]) {
            this.trendData.products[productId] = {
              ...product,
              mentions: 0,
              sentiment: 0,
              relatedKeywords: [],
              sources: [],
              lastUpdated: new Date().toISOString()
            };
          }
          
          const productData = this.trendData.products[productId];
          
          // Increment mentions
          productData.mentions += 1;
          
          // Add source if not already added
          const source = item.source;
          if (!productData.sources.includes(source)) {
            productData.sources.push(source);
          }
          
          // Extract related keywords
          const relatedKeywords = this.extractKeywords(results);
          relatedKeywords.forEach(keyword => {
            if (!productData.relatedKeywords.includes(keyword)) {
              productData.relatedKeywords.push(keyword);
            }
          });
          
          // Calculate sentiment
          productData.sentiment = this.calculateSentiment(results);
          
          // Update last updated timestamp
          productData.lastUpdated = new Date().toISOString();
        });
      });
      
      return {
        success: true,
        message: 'Successfully analyzed data by product',
        products: this.trendData.products
      };
    } catch (error) {
    <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>