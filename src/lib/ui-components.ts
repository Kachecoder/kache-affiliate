/**
 * Aceternity UI configuration and component setup
 * 
 * This file sets up the Aceternity UI components for use in the project.
 * It provides a centralized place to import and configure UI components.
 */

// Import necessary components from Aceternity UI
// Note: You'll need to install the aceternity-ui package
// npm install aceternity-ui

// This is a placeholder for actual Aceternity UI imports
// Replace with actual imports once the package is installed

// Example component exports (to be replaced with actual components)
import React, { ReactNode, HTMLAttributes } from 'react';

export const Card: React.FC<{ children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
      <div 
        className={`bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm ${className}`} 
        {...props}
      >
        {children}
      </div>
    );
};

export const Button: React.FC<{ children: ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, variant = 'primary', className = '', ...props }) => {
    const variantClasses: Record<string, string> = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
        secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
        outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    };

return (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
  
  // Add more component exports as needed
  
  // Animation utilities
  export const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
  };
  export const getThemeClass = (theme: 'light' | 'dark' | 'system'): string => {
      const themes: Record<string, string> = {
        light: 'light',
        dark: 'dark',
        system: 'system',
      };
      
      return themes[theme] || themes.system;
  };
  