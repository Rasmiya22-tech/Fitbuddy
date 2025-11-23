import { fitnessApi } from '../../api/apiClient';

export default {
  // Search exercises by various filters using /exercises endpoint
  searchExercises: async ({ name = '', type = '', muscle = '', difficulty = '' } = {}) => {
    try {
      const params = { limit: 20 };
      
      if (name) params.name = name;
      if (type) params.type = type;
      if (muscle) params.muscle = muscle;
      if (difficulty) params.difficulty = difficulty;
      
      console.log('🔍 Searching exercises with params:', params);
      const { data } = await fitnessApi.get('/exercises', { params });
      
      // Ensure data is an array
      const exercises = Array.isArray(data) ? data : [];
      
      console.log('✅ Found exercises:', exercises.length);
      
      return exercises.map((ex, idx) => ({
        id: `${ex.name}-${ex.type}-${idx}`, // Unique ID combining name, type and index
        title: ex.name,
        description: ex.instructions || `Target: ${ex.muscle}`,
        type: ex.type,
        muscle: ex.muscle,
        difficulty: ex.difficulty,
        equipment: ex.equipment || 'No equipment',
        status: ex.difficulty === 'easy' ? 'Beginner' : ex.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
        image: null // API doesn't provide images
      }));
    } catch (error) {
      console.error('❌ Error fetching exercises:', error.message);
      return [];
    }
  },

  // Get calories burned for a specific activity
  getCaloriesBurned: async (activity = '', weight = 160, duration = 60) => {
    try {
      const params = { activity };
      if (weight) params.weight = weight;
      if (duration) params.duration = duration;
      
      console.log('🔥 Fetching calories burned for:', activity);
      const { data } = await fitnessApi.get('/caloriesburned', { params });
      
      // Ensure data is an array
      const results = Array.isArray(data) ? data : [];
      
      console.log('✅ Found calorie data:', results.length);
      
      return results;
    } catch (error) {
      console.error('❌ Error fetching calories burned:', error.message);
      return [];
    }
  },

  // Get all available calorie burn activities
  getCaloriesBurnedActivities: async () => {
    try {
      console.log('📋 Fetching available activities...');
      const { data } = await fitnessApi.get('/caloriesburnedactivities');
      
      const activities = Array.isArray(data) ? data : [];
      console.log('✅ Found activities:', activities.length);
      
      return activities;
    } catch (error) {
      console.error('❌ Error fetching activities:', error.message);
      return [];
    }
  },

  // Get popular exercises by muscle group
  getExercisesByMuscle: async (muscle = 'biceps') => {
    return await this.searchExercises({ muscle });
  },

  // Get all exercise types
  getExerciseTypes: async () => {
    return ['cardio', 'olympic_weightlifting', 'plyometrics', 'powerlifting', 'strength', 'stretching', 'strongman'];
  },

  // Get all muscle groups
  getMuscleGroups: async () => {
    return ['abdominals', 'adductors', 'biceps', 'calves', 'chest', 'forearms', 'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 'shoulders', 'traps', 'triceps'];
  },

  // Get difficulty levels
  getDifficultyLevels: async () => {
    return ['beginner', 'intermediate', 'expert'];
  }
};
