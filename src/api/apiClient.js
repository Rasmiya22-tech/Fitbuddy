import axios from 'axios';

// API client for dummyJSON (products)
export const dummyJsonApi = axios.create({ 
  baseURL: 'https://dummyjson.com' 
});

// API client for API-Ninjas (fitness data)
export const fitnessApi = axios.create({ 
  baseURL: 'https://api.api-ninjas.com/v1',
  headers: {
    'X-Api-Key': '1VMN+wAexDrKhmBGDmmrtw==d6z6aQIi5OtjQCCy' 
  }
});

export default dummyJsonApi;
