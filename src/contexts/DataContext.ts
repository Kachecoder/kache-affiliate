/**
 * Data Context Provider
 * 
 * This context provides global state management for all data related to the affiliate marketing agent.
 * It manages scraped data, trend analysis results, competitor information, and marketing strategies.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state for the data context
const initialState = {
  // Scraped data from various sources
  scrapedData: {
    products: [],
    marketplaces: [],
    socialMedia: [],
    loading: false,
    error: null,
  },
  
  // Trend analysis data
  trends: {
    currentTrends: [],
    historicalTrends: [],
    predictions: [],
    loading: false,
    error: null,
  },
  
  // Competitor analysis data
  competitors: {
    list: [],
    strategies: [],
    performance: [],
    loading: false,
    error: null,
  },
  
  // Marketing strategy data
  strategies: {
    recommended: [],
    custom: [],
    performance: [],
    loading: false,
    error: null,
  },
  
  // User preferences for affiliate marketing
  preferences: {
    niches: [
      "Survival & Emergency Preparedness",
      "DIY & Home Improvement",
      "Personal Finance & Making Money Online",
      "E-Learning & Skill-Building",
      "AI & Automation Tools"
    ],
    targetIncome: 10000, // $10,000 monthly target
    budget: 20, // Starting with $20 budget
    timeAvailable: 25, // 20-30 hours per week average
  },
};

// Action types for the reducer
const ACTION_TYPES = {
  SET_SCRAPED_DATA: 'SET_SCRAPED_DATA',
  SET_TRENDS_DATA: 'SET_TRENDS_DATA',
  SET_COMPETITORS_DATA: 'SET_COMPETITORS_DATA',
  SET_STRATEGIES_DATA: 'SET_STRATEGIES_DATA',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Reducer function to handle state updates
const dataReducer = (state: typeof initialState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case ACTION_TYPES.SET_SCRAPED_DATA:
      return {
        ...state,
        scrapedData: {
          ...state.scrapedData,
          ...action.payload,
          loading: false,
          error: null,
        },
      };
      
    case ACTION_TYPES.SET_TRENDS_DATA:
      return {
        ...state,
        trends: {
          ...state.trends,
          ...action.payload,
          loading: false,
          error: null,
        },
      };
      
    case ACTION_TYPES.SET_COMPETITORS_DATA:
      return {
        ...state,
        competitors: {
          ...state.competitors,
          ...action.payload,
          loading: false,
          error: null,
        },
      };
      
    case ACTION_TYPES.SET_STRATEGIES_DATA:
      return {
        ...state,
        strategies: {
          ...state.strategies,
          ...action.payload,
          loading: false,
          error: null,
        },
      };
      
    case ACTION_TYPES.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };
      
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        [action.payload.dataType]: {
          ...state[action.payload.dataType],
          loading: action.payload.isLoading,
        },
      };
      
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        [action.payload.dataType]: {
          ...state[action.payload.dataType],
          error: action.payload.error,
          loading: false,
        },
      };
      
    default:
      return state;
  }
};

// Create the context
const DataContext = createContext<{
  state: typeof initialState;
  actions: {
export const DataProvider: React.FC = ({ children }) => {
    setTrendsData: (data: any) => void;
    setCompetitorsData: (data: any) => void;
    setStrategiesData: (data: any) => void;
    updatePreferences: (preferences: any) => void;
    setScrapedData: (data: any) => {
    setError: (dataType: keyof typeof initialState, error: any) => void;
  };
} | null>(null);
    setTrendsData: (data: any) => {
// Data provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
    setCompetitorsData: (data: any) => {
  // Actions for updating the state
  const actions = {
    setScrapedData: (data) => {
    setStrategiesData: (data: any) => {
    },
    
    setTrendsData: (data) => {
    updatePreferences: (preferences: any) => {
    },
    
    setCompetitorsData: (data) => {
    setLoading: (dataType: keyof typeof initialState, isLoading: boolean) => {
    },
    
    setStrategiesData: (data) => {
      dispatch({ type: ACTION_TYPES.SET_STRATEGIES_DATA, payload: data });
    },
    
    setError: (dataType: keyof typeof initialState, error: any) => {
      dispatch({ type: ACTION_TYPES.UPDATE_PREFERENCES, payload: preferences });
    },
    
    setLoading: (dataType, isLoading) => {
      dispatch({ 
        type: ACTION_TYPES.SET_LOADING, 
        payload: { dataType, isLoading } 
      });
    },
    
    setError: (dataType, error) => {
      dispatch({ 
        type: ACTION_TYPES.SET_ERROR, 
        payload: { dataType, error } 
      });
    },
  };
  
  return (
    <DataContext.Provider value={{ state, actions }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
