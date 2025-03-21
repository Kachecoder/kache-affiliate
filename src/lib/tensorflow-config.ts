/**
 * TensorFlow.js Configuration
 * 
 * This file contains the configuration for TensorFlow.js models and operations.
 * It sets up the environment for machine learning tasks in the browser.
 */

import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
const initializeTensorFlow = async () => {
  try {
    // Use WebGL backend for better performance in browser
    await tf.setBackend('webgl');
    console.log('TensorFlow.js initialized with backend:', tf.getBackend());
    
    // Log memory info for debugging
    const memoryInfo = tf.memory();
    console.log('TensorFlow memory usage:', memoryInfo);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    return false;
  }
};

// Helper function to load models
const loadModel = async (modelPath: string): Promise<tf.LayersModel | null> => {
  try {
    const model = await tf.loadLayersModel(modelPath);
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    return null;
  }
};

// Helper function to make predictions
const makePrediction = async (model: tf.LayersModel, inputData: number[] | number[][]): Promise<number[] | null> => {
  try {
    // Convert input data to tensor
    const inputTensor = tf.tensor(inputData);
    
    // Make prediction
    const prediction = model.predict(inputTensor);
    
    // Get prediction data as JavaScript array
    let predictionData: number[];
    if (Array.isArray(prediction)) {
      predictionData = (await Promise.all(prediction.map(async tensor => Array.from(await tensor.data())))).flat();
    } else {
      predictionData = Array.from(await prediction.data());
    }
    
    // Clean up tensors
    inputTensor.dispose();
    if (Array.isArray(prediction)) {
      prediction.forEach(tensor => tensor.dispose());
    } else {
      prediction.dispose();
    }
    
    return predictionData;
  } catch (error) {
    console.error('Prediction error:', error);
    return null;
  }
};

export { initializeTensorFlow, loadModel, makePrediction };
