import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tips: [
    {
      id: '1',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily to maintain proper hydration and boost metabolism.',
      icon: 'droplet',
      color: '#3498db',
      category: 'hydration'
    },
    {
      id: '2',
      title: 'Quality Sleep',
      description: 'Get 7-9 hours of sleep each night for better recovery and muscle growth.',
      icon: 'moon',
      color: '#2c3e50',
      category: 'rest'
    },
    {
      id: '3',
      title: 'Balanced Diet',
      description: 'Consume proteins, carbs, and healthy fats in proper proportions for optimal health.',
      icon: 'coffee',
      color: '#27ae60',
      category: 'nutrition'
    },
    {
      id: '4',
      title: 'Regular Exercise',
      description: 'Aim for at least 150 minutes of moderate-intensity exercise per week.',
      icon: 'activity',
      color: '#e74c3c',
      category: 'exercise'
    },
    {
      id: '5',
      title: 'Stress Management',
      description: 'Practice meditation, yoga, or deep breathing to reduce stress and improve mental health.',
      icon: 'wind',
      color: '#9b59b6',
      category: 'mindfulness'
    },
    {
      id: '6',
      title: 'Morning Stretching',
      description: 'Start your day with 10-15 minutes of light stretching to improve flexibility.',
      icon: 'trending-up',
      color: '#f39c12',
      category: 'flexibility'
    },
    {
      id: '7',
      title: 'Consistent Tracking',
      description: 'Keep track of your workouts, water intake, and meals for better progress monitoring.',
      icon: 'bar-chart-2',
      color: '#16a085',
      category: 'tracking'
    },
    {
      id: '8',
      title: 'Warm Up Before Workout',
      description: 'Always warm up for 5-10 minutes before starting your exercise to prevent injuries.',
      icon: 'zap',
      color: '#d35400',
      category: 'safety'
    }
  ],
  selectedCategory: 'all',
  savedTips: []
};

const wellnessSlice = createSlice({
  name: 'wellness',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    saveTip: (state, action) => {
      if (!state.savedTips.includes(action.payload)) {
        state.savedTips.push(action.payload);
      }
    },
    removeTip: (state, action) => {
      state.savedTips = state.savedTips.filter(id => id !== action.payload);
    }
  }
});

export const { setSelectedCategory, saveTip, removeTip } = wellnessSlice.actions;
export default wellnessSlice.reducer;
