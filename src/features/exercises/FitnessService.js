import { fitnessApi } from '../../api/apiClient';

export default {
  // Search exercises by various filters using /allexercises endpoint
  searchExercises: async ({ name = '', type = '', muscle = '', difficulty = '' } = {}) => {
    try {
      let url = '/allexercises?';
      const params = [];
      
      if (name) params.push(`name=${encodeURIComponent(name)}`);
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      if (muscle) params.push(`muscle=${encodeURIComponent(muscle)}`);
      if (difficulty) params.push(`difficulty=${encodeURIComponent(difficulty)}`);
      
      url += params.join('&');
      
      const { data } = await fitnessApi.get(url);
      
      // Ensure data is an array
      const exercises = Array.isArray(data) ? data : [];
      
      return exercises.map((ex, idx) => ({
        id: `${ex.name}-${ex.type}-${idx}`, // Unique ID combining name, type and index
        title: ex.name,
        description: ex.instructions || 'No instructions provided',
        type: ex.type,
        muscle: ex.muscle,
        difficulty: ex.difficulty,
        equipment: ex.equipment || 'No equipment',
        image: null // API doesn't provide images
      }));
    } catch (error) {
      console.error('Error fetching exercises:', error);
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
