import axios from 'axios';

// API client for dummyJSON (products)
export const dummyJsonApi = axios.create({ 
  baseURL: 'https://dummyjson.com' 
});

// API client for api-ninjas (exercises) - Free tier available
export const fitnessApi = axios.create({ 
  baseURL: 'https://api.api-ninjas.com/v1',
  headers: {
    'X-Api-Key': 'test' // Free tier or replace with your api-ninjas key
  }
});

export default dummyJsonApi;
