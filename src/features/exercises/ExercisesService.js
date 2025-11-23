import { fitnessApi } from '../../api/apiClient';

export default {
  // Fetch exercises from API-Ninjas
  getExercises: async () => {
    try {
      console.log('🏋️ Fetching exercises from API-Ninjas...');
      const response = await fitnessApi.get('/exercises', { params: { limit: 20, muscle: 'chest' } });
      
      console.log('📦 API Response:', {
        status: response.status,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        data: response.data
      });
      
      // API-Ninjas returns an array directly, sometimes empty or with results
      let exercises = Array.isArray(response.data) ? response.data : [];
      
      if (!exercises || exercises.length === 0) {
        console.warn('⚠️ API returned no exercises, using fallback');
        return getFallbackExercises();
      }
      
      console.log('✅ Exercises fetched successfully:', exercises.length);
      
      // Transform API response to match card format
      return exercises.map((exercise, index) => ({
        id: `${exercise.name}-${index}`,
        title: exercise.name,
        description: exercise.description || `Target: ${exercise.muscle}`,
        muscle: exercise.muscle,
        difficulty: exercise.difficulty || 'intermediate',
        type: exercise.type,
        equipment: exercise.equipment || 'No equipment',
        status: exercise.difficulty === 'easy' ? 'Beginner' : exercise.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
        image: null,
      }));
    } catch (error) {
      console.error('❌ API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      console.log('📋 Using fallback exercises instead...');
      return getFallbackExercises();
    }
  }
};

// Fallback exercises data when API is unavailable
function getFallbackExercises() {
  return [
    {
      id: '1',
      title: 'Push-ups',
      description: 'Target: Chest, Shoulders, Triceps',
      muscle: 'chest',
      difficulty: 'beginner',
      type: 'calisthenics',
      equipment: 'No equipment',
      status: 'Beginner'
    },
    {
      id: '2',
      title: 'Squats',
      description: 'Target: Legs, Glutes',
      muscle: 'quadriceps',
      difficulty: 'intermediate',
      type: 'calisthenics',
      equipment: 'No equipment',
      status: 'Intermediate'
    },
    {
      id: '3',
      title: 'Deadlifts',
      description: 'Target: Back, Hamstrings, Glutes',
      muscle: 'hamstrings',
      difficulty: 'advanced',
      type: 'barbell',
      equipment: 'Barbell',
      status: 'Advanced'
    },
    {
      id: '4',
      title: 'Pull-ups',
      description: 'Target: Back, Biceps',
      muscle: 'lats',
      difficulty: 'intermediate',
      type: 'calisthenics',
      equipment: 'Pull-up bar',
      status: 'Intermediate'
    },
    {
      id: '5',
      title: 'Bench Press',
      description: 'Target: Chest, Triceps, Shoulders',
      muscle: 'chest',
      difficulty: 'intermediate',
      type: 'barbell',
      equipment: 'Barbell, Bench',
      status: 'Intermediate'
    },
    {
      id: '6',
      title: 'Dumbbell Rows',
      description: 'Target: Back, Biceps',
      muscle: 'lats',
      difficulty: 'intermediate',
      type: 'dumbbell',
      equipment: 'Dumbbells',
      status: 'Intermediate'
    },
    {
      id: '7',
      title: 'Plank',
      description: 'Target: Core, Shoulders, Back',
      muscle: 'abs',
      difficulty: 'beginner',
      type: 'calisthenics',
      equipment: 'No equipment',
      status: 'Beginner'
    },
    {
      id: '8',
      title: 'Lunges',
      description: 'Target: Legs, Glutes',
      muscle: 'quadriceps',
      difficulty: 'intermediate',
      type: 'calisthenics',
      equipment: 'No equipment',
      status: 'Intermediate'
    },
    {
      id: '9',
      title: 'Dumbbell Curl',
      description: 'Target: Biceps',
      muscle: 'biceps',
      difficulty: 'beginner',
      type: 'dumbbell',
      equipment: 'Dumbbells',
      status: 'Beginner'
    },
    {
      id: '10',
      title: 'Leg Press',
      description: 'Target: Legs, Glutes',
      muscle: 'quadriceps',
      difficulty: 'intermediate',
      type: 'machine',
      equipment: 'Leg Press Machine',
      status: 'Intermediate'
    }
  ];
}
