import React, { useEffect } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchExercises } from './exercisesSlice';
import ExerciseCard from './ExerciseCard';
import WaterTracker from '../water/WaterTracker';
import CaloriesBurnedCard from './CaloriesBurnedCard';
import { getTheme } from '../ui/themeColors';

const { width } = Dimensions.get('window');

// Wellness tips data
const wellnessTips = [
  {
    id: '1',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain proper hydration and boost metabolism.',
    icon: 'water',
    color: '#3498db'
  },
  {
    id: '2',
    title: 'Quality Sleep',
    description: 'Get 7-9 hours of sleep each night for better recovery and muscle growth.',
    icon: 'moon',
    color: '#2c3e50'
  },
  {
    id: '3',
    title: 'Balanced Diet',
    description: 'Consume proteins, carbs, and healthy fats in proper proportions for optimal health.',
    icon: 'gift',
    color: '#27ae60'
  },
  {
    id: '4',
    title: 'Regular Exercise',
    description: 'Aim for at least 150 minutes of moderate-intensity exercise per week.',
    icon: 'activity',
    color: '#e74c3c'
  },
  {
    id: '5',
    title: 'Stress Management',
    description: 'Practice meditation, yoga, or deep breathing to reduce stress and improve mental health.',
    icon: 'wind',
    color: '#9b59b6'
  },
  {
    id: '6',
    title: 'Morning Stretching',
    description: 'Start your day with 10-15 minutes of light stretching to improve flexibility.',
    icon: 'align-center',
    color: '#f39c12'
  }
];

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const username = useSelector(s => s.auth.username);
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);
  const exercises = useSelector(s => s.exercises.items);
  const exercisesStatus = useSelector(s => s.exercises.status);
  const exercisesError = useSelector(s => s.exercises.error);
  const waterCups = useSelector(s => s.water.cups);
  const waterGoal = useSelector(s => s.water.dailyGoal);
  const favourites = useSelector(s => s.favourites.items);
  const [selectedTip, setSelectedTip] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Calculate dynamic stats based on fetched data
  const dynamicStats = {
    exercises: exercises.length,
    workouts: favourites.length, // Number of saved workouts
    water: { cups: waterCups, goal: waterGoal },
    difficulty: exercises.reduce((acc, ex) => {
      if (ex.difficulty === 'beginner' || ex.difficulty === 'easy') acc.easy++;
      else if (ex.difficulty === 'intermediate') acc.intermediate++;
      else if (ex.difficulty === 'advanced' || ex.difficulty === 'expert') acc.advanced++;
      return acc;
    }, { easy: 0, intermediate: 0, advanced: 0 })
  };

  useEffect(() => {
    if (exercisesStatus === 'idle') {
      dispatch(fetchExercises());
    }
  }, [dispatch, exercisesStatus]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchExercises()).finally(() => setRefreshing(false));
  };

  const handleExercisePress = (item) => {
    navigation.navigate('Details', { item });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {/* Header with greeting */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }] }>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello, {username || 'Fitness Enthusiast'}! 👋</Text>
          <Text style={[styles.date, { color: colors.muted }]}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: colors.primary + '20' }]}>
          <Feather name="heart" size={32} color={colors.primary} />
        </View>
      </View>

      {/* Daily Stats */}
      <View style={styles.statsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Activity</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="zap" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{dynamicStats.exercises}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Exercises</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="heart" size={24} color="#e74c3c" />
            <Text style={[styles.statValue, { color: colors.text }]}>{dynamicStats.workouts}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Saved</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="water" size={24} color="#3498db" />
            <Text style={[styles.statValue, { color: colors.text }]}>{dynamicStats.water.cups}/{dynamicStats.water.goal}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Water</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="trending-up" size={24} color="#f39c12" />
            <Text style={[styles.statValue, { color: colors.text }]}>{dynamicStats.difficulty.intermediate}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Mid-Level</Text>
          </View>
        </View>
      </View>

      {/* Water Tracker Component */}
      <WaterTracker />

      {/* Calories Burned Component */}
      <CaloriesBurnedCard navigation={navigation} />

      {/* Featured Exercises Section */}
      <View style={styles.exercisesContainer}>
        <View style={styles.exercisesHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Workouts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Exercises')}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {exercisesStatus === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.muted }]}>Loading workouts...</Text>
          </View>
        )}

        {/* Error State */}
        {exercisesStatus === 'failed' && (
          <View style={[styles.errorContainer, { backgroundColor: colors.dangerBg }]}>
            <Feather name="alert-circle" size={24} color="#ff6b6b" />
            <Text style={[styles.errorText, { color: '#ff6b6b' }]}>Failed to load workouts</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={handleRefresh}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercises List */}
        {exercisesStatus === 'succeeded' && exercises.length > 0 && (
          <FlatList
            data={exercises.slice(0, 3)}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ExerciseCard 
                item={item} 
                onPress={() => handleExercisePress(item)}
                showFavButton={true}
              />
            )}
          />
        )}

        {/* Empty State */}
        {exercisesStatus === 'succeeded' && exercises.length === 0 && (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No workouts available</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Exercises')}
          >
            <Feather name="zap" size={28} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Find Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="heart" size={28} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Favourites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="pie-chart" size={28} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Track Diet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="bar-chart-2" size={28} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Stats</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wellness Tips */}
      <View style={styles.tipsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Wellness Tips</Text>
        <FlatList
          data={wellnessTips}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setSelectedTip(selectedTip === item.id ? null : item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.tipIcon, { backgroundColor: item.color + '20' }]}>
                <Feather name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: colors.text }]}>{item.title}</Text>
                {selectedTip === item.id && (
                  <Text style={[styles.tipDescription, { color: colors.muted }]}>{item.description}</Text>
                )}
              </View>
              <Feather 
                name={selectedTip === item.id ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Motivation Section */}
      <View style={styles.motivationContainer}>
        <View style={[styles.motivationCard, { backgroundColor: colors.primary }]}>
          <Feather name="award" size={40} color={colors.surface} />
          <Text style={[styles.motivationText, { color: colors.surface }]}>You're doing great! Keep up the consistency and you'll achieve your fitness goals. 💪</Text>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    marginTop: 4,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  statCard: {
    width: (width - 40) / 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  exercisesContainer: {
    marginBottom: 16,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    marginHorizontal: 12,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  actionButton: {
    width: (width - 40) / 2,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  tipsContainer: {
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
  },
  tipIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tipDescription: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  motivationContainer: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  motivationCard: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
});
