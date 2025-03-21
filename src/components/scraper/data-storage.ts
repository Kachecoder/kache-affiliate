/**
 * Data Storage Utility
 * 
 * This utility provides functions for storing and retrieving scraped data.
 * It handles data persistence, indexing, and retrieval for the scraper service.
 */

// Class for managing scraped data storage
class DataStorage {
    private data: {
        socialMedia: Record<string, any>;
        affiliateNetworks: Record<string, any>;
        websites: Record<string, any>;
        trends: Record<string, any>;
        competitors: Record<string, any>;
    };

    private indexes: {
        byDate: Record<string, string[]>;
        bySource: Record<string, string[]>;
        byKeyword: Record<string, string[]>;
    };

    constructor() {
      this.data = {
        socialMedia: {},
        affiliateNetworks: {},
        websites: {},
        trends: {},
        competitors: {}
      };
      
      this.indexes = {
        byDate: {},
        bySource: {},
        byKeyword: {}
      };
    }
    
    // Initialize storage
    initialize() {
      try {
        // In a real implementation, this would load data from localStorage, IndexedDB, or a backend
        console.log('Initializing data storage');
        
        // Try to load from localStorage if available
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedData = localStorage.getItem('kache_affiliate_data');
          if (savedData) {
            this.data = JSON.parse(savedData);
            console.log('Loaded data from localStorage');
          }
          
          const savedIndexes = localStorage.getItem('kache_affiliate_indexes');
          if (savedIndexes) {
            this.indexes = JSON.parse(savedIndexes);
            console.log('Loaded indexes from localStorage');
          }
        }
        
        return true;
      } catch (error) {
        console.error('Failed to initialize data storage:', error);
        return false;
      }
    }
    
    // Save data to persistent storage
    saveToStorage() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('kache_affiliate_data', JSON.stringify(this.data));
          localStorage.setItem('kache_affiliate_indexes', JSON.stringify(this.indexes));
          console.log('Saved data to localStorage');
        }
        return true;
      } catch (error) {
        console.error('Failed to save data to storage:', error);
        return false;
      }
    }
    
    // Store scraped data
    storeData(category: keyof DataStorage['data'], source: string, data: any) {
      try {
        const timestamp = new Date().toISOString();
        const id = `${category}_${source}_${timestamp}`;
        
        // Store the data
        if (!this.data[category]) {
          this.data[category] = {};
        }
        
        this.data[category][id] = {
          id,
          category,
          source,
          timestamp,
          data
        };
        
        // Update indexes
        this._updateIndexes(id, category, source, data);
        
        // Save to persistent storage
        this.saveToStorage();
        
        return id;
      } catch (error) {
        console.error('Failed to store data:', error);
        return null;
      }
    }
    
    // Update indexes for faster retrieval
    _updateIndexes(id: string, category: keyof DataStorage['data'], source: string, data: any) {
      // Index by date
      const date = new Date().toISOString().split('T')[0];
      if (!this.indexes.byDate[date]) {
        this.indexes.byDate[date] = [];
      }
      this.indexes.byDate[date].push(id);
      
      // Index by source
      const sourceKey = `${category}_${source}`;
      if (!this.indexes.bySource[sourceKey]) {
        this.indexes.bySource[sourceKey] = [];
      }
      this.indexes.bySource[sourceKey].push(id);
      
      // Index by keywords (if available)
      if (data.query) {
        const keyword = data.query.toLowerCase();
        if (!this.indexes.byKeyword[keyword]) {
          this.indexes.byKeyword[keyword] = [];
        }
        this.indexes.byKeyword[keyword].push(id);
      }
    }
    
    // Get data by ID
    getData(id: string) {
      for (const category in this.data) {
        if (this.data[category as keyof DataStorage['data']][id]) {
          return this.data[category as keyof DataStorage['data']][id];
        }
      }
      return null;
    }
    
    // Get all data for a category
    getCategoryData(category: keyof DataStorage['data']) {
      return this.data[category] || {};
    }
    
    // Get data by source
    getDataBySource(category: keyof DataStorage['data'], source: string) {
      const sourceKey = `${category}_${source}`;
      const ids = this.indexes.bySource[sourceKey] || [];
      
      return ids.map(id => this.getData(id)).filter(Boolean);
    }
    
    // Get data by date
    getDataByDate(date: string) {
      const ids = this.indexes.byDate[date] || [];
      
      return ids.map(id => this.getData(id)).filter(Boolean);
    }
    
    // Get data by keyword
    getDataByKeyword(keyword: string) {
      const normalizedKeyword = keyword.toLowerCase();
      const ids = this.indexes.byKeyword[normalizedKeyword] || [];
      
      return ids.map(id => this.getData(id)).filter(Boolean);
    }
    
    // Search data using multiple criteria
    searchData(criteria: { category?: keyof DataStorage['data']; source?: string; keyword?: string; dateFrom?: string; dateTo?: string } = {}) {
      const { category, source, keyword, dateFrom, dateTo } = criteria;
      
      // Start with all data
      let allData = [];
      for (const cat in this.data) {
        if (!category || category === cat) {
          for (const id in this.data[cat as keyof DataStorage['data']]) {
            allData.push(this.data[cat as keyof DataStorage['data']][id]);
          }
        }
      }
      
      // Filter by source
      if (source) {
        allData = allData.filter(item => item.source === source);
      }
      
      // Filter by keyword
      if (keyword) {
        const normalizedKeyword = keyword.toLowerCase();
        allData = allData.filter(item => {
          // Check if the keyword is in the query
          if (item.data.query && item.data.query.toLowerCase().includes(normalizedKeyword)) {
            return true;
          }
          
          // Check if the keyword is in the results (simplified)
          if (item.data.results) {
            if (Array.isArray(item.data.results)) {
              return item.data.results.some(result => 
                JSON.stringify(result).toLowerCase().includes(normalizedKeyword)
              );
            } else {
              return JSON.stringify(item.data.results).toLowerCase().includes(normalizedKeyword);
            }
          }
          
          return false;
        });
      }
      
      // Filter by date range
      if (dateFrom || dateTo) {
        allData = allData.filter(item => {
          const itemDate = new Date(item.timestamp);
          
          if (dateFrom && dateTo) {
            const from = new Date(dateFrom);
            const to = new Date(dateTo);
            return itemDate >= from && itemDate <= to;
          } else if (dateFrom) {
            const from = new Date(dateFrom);
            return itemDate >= from;
          } else if (dateTo) {
            const to = new Date(dateTo);
            return itemDate <= to;
          }
          
          return true;
        });
      }
      
      return allData;
    }
    
    // Delete data by ID
    deleteData(id: string) {
      for (const category in this.data) {
        if (category in this.data && this.data[category as keyof DataStorage['data']][id]) {
          delete this.data[category as keyof DataStorage['data']][id];
          
          // Update indexes
          for (const date in this.indexes.byDate) {
            this.indexes.byDate[date] = this.indexes.byDate[date].filter(itemId => itemId !== id);
          }
          
          for (const source in this.indexes.bySource) {
            this.indexes.bySource[source] = this.indexes.bySource[source].filter(itemId => itemId !== id);
          }
          
          for (const keyword in this.indexes.byKeyword) {
            this.indexes.byKeyword[keyword] = this.indexes.byKeyword[keyword].filter(itemId => itemId !== id);
          }
          
          // Save to persistent storage
          this.saveToStorage();
          
          return true;
        }
      }
      
      return false;
    }
    
    // Clear all data
    clearAllData() {
      this.data = {
        socialMedia: {},
        affiliateNetworks: {},
        websites: {},
        trends: {},
        competitors: {}
      };
      
      this.indexes = {
        byDate: {},
        bySource: {},
        byKeyword: {}
      };
      
      // Save to persistent storage
      this.saveToStorage();
      
      return true;
    }
    
    // Get storage statistics
    getStats() {
      const stats = {
        totalItems: 0,
        byCategory: Record<string, number> = {},
        bySource: Record<string, number> = {},
        byDate: Record<string, number> = {}
      };
      
      // Count items by category
      for (const category in this.data) {
        const count = Object.keys(this.data[category as keyof DataStorage['data']]).length;
        stats.totalItems += count;
        stats.byCategory[category] = count;
      }
      
      // Count items by source
      for (const source in this.indexes.bySource) {
        stats.bySource[source] = (this.indexes.bySource[source] || []).length;
      }
      
      // Count items by date
      for (const date in this.indexes.byDate) {
        stats.byDate[date] = this.indexes.byDate[date].length;
      }
      
      return stats;
    }
  }
  
  // Export a singleton instance
  const dataStorage = new DataStorage();
  export default dataStorage;
  