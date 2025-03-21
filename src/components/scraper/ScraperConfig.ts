/**
 * Scraper Configuration Component
 * 
 * This component provides a user interface for configuring and managing
 * data scraping operations for the affiliate marketing AI agent.
 */

import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import * as scraperService from '../../services/scraper/scraper-service';
import * as dataStorage from '../../services/scraper/data-storage';
import { Button, Card } from '../../lib/ui-components';

const ScraperConfig = () => {
  const { state, actions } = useData() as { state: any; actions: any };
  
  // State for scraper configuration
  const [config, setConfig] = useState({
    sources: {
      socialMedia: true,
      affiliateNetworks: true,
      websites: true
    },
    platforms: {
      twitter: true,
      pinterest: true,
      tiktok: true
    },
    networks: {
      amazon: true,
      clickbank: true,
      shareasale: true
    },
    websites: []
  });
  
  // State for scraping tasks
  const [tasks, setTasks] = useState<{ id: string; source: string; target: string; status: string; error?: string }[]>([]);
  const [newTask, setNewTask] = useState<{
    source: string;
    target: string;
    options: Record<string, any>;
  }>({
    source: 'twitter',
    target: '',
    options: {}
  });
  
  // State for results
  const [results, setResults] = useState<Record<string, { results?: any[] }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize scraper and data storage
  useEffect(() => {
    const initializeScraper = async () => {
      try {
        await scraperService.initialize(config); // Ensure this method exists in scraper-service.ts
        await dataStorage.initialize();
        
        // Load existing tasks
        const existingTasks = scraperService.getAllTasks(); // Ensure this method exists in scraper-service.ts
        setTasks(existingTasks);
        
        // Load existing results
        const existingResults = dataStorage.getStats();
        console.log('Data storage stats:', existingResults);
      } catch (error) {
        console.error('Failed to initialize scraper:', error);
        setError('Failed to initialize scraper: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };
    
    initializeScraper();
  }, []);
  
  // Handle config changes
  const handleConfigChange = (category: keyof typeof config, item: string, value: boolean) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [category]: {
        ...prevConfig[category],
        [item]: value
      }
    }));
  };
  
  // Handle new task input changes
  const handleNewTaskChange = (field: keyof typeof newTask, value: string) => {
    setNewTask(prevTask => ({
      ...prevTask,
      [field]: value
    }));
  };
  
  // Add a new scraping task
  const addTask = () => {
    if (!newTask.target.trim()) {
      setError('Please enter a target keyword or URL');
      return;
    }
    
    try {
      const taskId = scraperService.addTask(
        newTask.source,
        newTask.target,
        newTask.options
      );
      
      // Update tasks list
      setTasks(scraperService.getAllTasks());
      
      // Reset new task form
      setNewTask({
        source: 'twitter',
        target: '',
        options: {}
      });
      
      setError(null);
    } catch (error) {
      console.error('Failed to add task:', error);
      setError('Failed to add task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  // Execute a specific task
  const executeTask = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await scraperService.executeTask(taskId);
      
      // Store the result
      const storageId = dataStorage.storeData(
        result.platform || result.network || 'website',
        result.platform || result.network || 'custom',
        result
      );
      
      // Update results
      setResults(prevResults => ({
        ...prevResults,
        [taskId]: result
      }));
      
      // Update tasks list
      setTasks(scraperService.getAllTasks());
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to execute task:', error);
      setError('Failed to execute task: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsLoading(false);
    }
  };
  
  // Execute all pending tasks
  const executeAllTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await scraperService.executeAllPendingTasks();
      
      // Store results
      results.forEach((result: { success: boolean; result: { platform?: string; network?: string } }) => {
        if (result.success) {
          dataStorage.storeData(
            result.result.platform || result.result.network || 'website',
            result.result.platform || result.result.network || 'custom',
            result.result
          );
        }
      });
      
      // Update tasks list
      setTasks(scraperService.getAllTasks());
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to execute tasks:', error);
      setError('Failed to execute tasks: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsLoading(false);
    }
  };
  
  // Delete a task
  const deleteTask = (taskId: string) => {
    try {
      // In a real implementation, this would remove the task from the service
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Scraping Configuration</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {/* Scraper Configuration */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Scraper Settings</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium mb-2">Data Sources</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.sources.socialMedia}
                  onChange={(e) => handleConfigChange('sources', 'socialMedia', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Social Media</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.sources.affiliateNetworks}
                  onChange={(e) => handleConfigChange('sources', 'affiliateNetworks', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Affiliate Networks</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.sources.websites}
                  onChange={(e) => handleConfigChange('sources', 'websites', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Websites</span>
              </label>
            </div>
          </div>
          
          {config.sources.socialMedia && (
            <div>
              <h3 className="text-md font-medium mb-2">Social Media Platforms</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.platforms.twitter}
                    onChange={(e) => handleConfigChange('platforms', 'twitter', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Twitter</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.platforms.pinterest}
                    onChange={(e) => handleConfigChange('platforms', 'pinterest', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Pinterest</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.platforms.tiktok}
                    onChange={(e) => handleConfigChange('platforms', 'tiktok', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>TikTok</span>
                </label>
              </div>
            </div>
          )}
          
          {config.sources.affiliateNetworks && (
            <div>
              <h3 className="text-md font-medium mb-2">Affiliate Networks</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.networks.amazon}
                    onChange={(e) => handleConfigChange('networks', 'amazon', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Amazon</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.networks.clickbank}
                    onChange={(e) => handleConfigChange('networks', 'clickbank', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Clickbank</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.networks.shareasale}
                    onChange={(e) => handleConfigChange('networks', 'shareasale', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>ShareASale</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Add New Task */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Scraping Task</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source
            </label>
            <select
              value={newTask.source}
              onChange={(e) => handleNewTaskChange('source', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <optgroup label="Social Media">
                <option value="twitter">Twitter</option>
                <option value="pinterest">Pinterest</option>
                <option value="tiktok">TikTok</option>
              </optgroup>
              <optgroup label="Affiliate Networks">
                <option value="amazon">Amazon</option>
                <option value="clickbank">Clickbank</option>
                <option value="shareasale">ShareASale</option>
              </optgroup>
              <option value="custom">Custom Website</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {newTask.source === 'custom' ? 'URL' : 'Keyword or Query'}
            </label>
            <input
              type="text"
              value={newTask.target}
              onChange={(e) => handleNewTaskChange('target', e.target.value)}
              placeholder={newTask.source === 'custom' ? 'https://example.com' : 'Enter keyword or query'}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={addTask}>
              Add Task
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Task List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Scraping Tasks</h2>
          <Button onClick={executeAllTasks} disabled={isLoading || tasks.length === 0}>
            {isLoading ? 'Running...' : 'Run All Tasks'}
          </Button>
        </div>
        
        {tasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No tasks added yet. Add a task above to get started.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{task.source}</span>
                      <span className="text-gray-500 dark:text-gray-400">→</span>
                      <span>{task.target}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Status: <span className={`font-medium ${
                        task.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                        task.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                        task.status === 'running' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>{task.status}</span>
                    </div>
                    {task.error && (
                      <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                        Error: {task.error}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => executeTask(task.id)}
                      disabled={isLoading || task.status === 'running'}
                    >
                      {task.status === 'running' ? 'Running...' : 'Run'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => deleteTask(task.id)}
                      disabled={isLoading || task.status === 'running'}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                {task.status === 'completed' && results[task.id] && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm">
                      <div className="font-medium">Results:</div>
                      <div className="mt-1 text-gray-500 dark:text-gray-400">
                        Found {results[task.id].results?.length || 0} items
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Data Storage Stats */}
      <Card className="p-6">
        <h2 className="text-<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>