import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Wellness tips data
const wellnessTips = [
  {
    id: '1',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain proper hydration and boost metabolism.',
    icon: 'droplets',
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
    icon: 'apple',
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

// Daily stats mock data
const dailyStats = {
  calories: { burned: 420, goal: 500 },
  steps: { count: 8234, goal: 10000 },
  water: { cups: 6, goal: 8 },
  workouts: { completed: 1, goal: 1 }
};

export default function HomeScreen({ navigation }) {
  const username = useSelector(s => s.auth.username);
  const [selectedTip, setSelectedTip] = useState(null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {username || 'Fitness Enthusiast'}! 👋</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>
        <View style={styles.headerIcon}>
          <Feather name="heart" size={32} color="#e74c3c" />
        </View>
      </View>

      {/* Daily Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Feather name="zap" size={24} color="#e74c3c" />
            <Text style={styles.statValue}>{dailyStats.calories.burned}/{dailyStats.calories.goal}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="move" size={24} color="#3498db" />
            <Text style={styles.statValue}>{dailyStats.steps.count}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="droplets" size={24} color="#2980b9" />
            <Text style={styles.statValue}>{dailyStats.water.cups}/{dailyStats.water.goal}</Text>
            <Text style={styles.statLabel}>Water</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="check-circle" size={24} color="#27ae60" />
            <Text style={styles.statValue}>{dailyStats.workouts.completed}/{dailyStats.workouts.goal}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Exercises')}>
            <Feather name="zap" size={28} color="#944545" />
            <Text style={styles.actionText}>Find Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="droplets" size={28} color="#3498db" />
            <Text style={styles.actionText}>Log Water</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="pie-chart" size={28} color="#f39c12" />
            <Text style={styles.actionText}>Track Diet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="bar-chart-2" size={28} color="#27ae60" />
            <Text style={styles.actionText}>Stats</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wellness Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Wellness Tips</Text>
        <FlatList
          data={wellnessTips}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.tipCard}
              onPress={() => setSelectedTip(selectedTip === item.id ? null : item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.tipIcon, { backgroundColor: item.color + '20' }]}>
                <Feather name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{item.title}</Text>
                {selectedTip === item.id && (
                  <Text style={styles.tipDescription}>{item.description}</Text>
                )}
              </View>
              <Feather 
                name={selectedTip === item.id ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#944545" 
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Motivation Section */}
      <View style={styles.motivationContainer}>
        <View style={styles.motivationCard}>
          <Feather name="award" size={40} color="#f39c12" />
          <Text style={styles.motivationText}>You're doing great! Keep up the consistency and you'll achieve your fitness goals. 💪</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffe0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  statsContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 40) / 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 40) / 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  tipsContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
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
    color: '#333',
  },
  tipDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    lineHeight: 16,
  },
  motivationContainer: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  motivationCard: {
    backgroundColor: '#944545',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
});
