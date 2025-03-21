/**
 * _app.js - Next.js App Component
 * 
 * This is the main application component that wraps all pages.
 * It provides global context providers and layout.
 */

import { AppProps } from 'next/app';
import DataProvider from '../contexts/DataContext';
import MainLayout from '../components/layouts/MainLayout';
import { initializeTensorFlow } from '../lib/tensorflow-config';
import '../styles/globals.css';

// Initialize TensorFlow when the app loads
if (typeof window !== 'undefined') {
  initializeTensorFlow().then((success) => {
    if (success) {
      console.log('TensorFlow.js initialized successfully');
    } else {
      console.error('Failed to initialize TensorFlow.js');
    }
  });
}

function MyApp({ Component, pageProps }: AppProps & { Component: React.ComponentType }) {
  return (
    <DataProvider>
      <MainLayout>
        {Component && <Component {...pageProps} />}
      </MainLayout>
    </DataProvider>
  );
}

export default MyApp;
