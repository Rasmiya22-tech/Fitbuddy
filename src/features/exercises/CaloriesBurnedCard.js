import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { getTheme } from '../ui/themeColors';
import FitnessService from './FitnessService';

const { width } = Dimensions.get('window');

export default function CaloriesBurnedCard({ navigation }) {
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);
  const [caloriesData, setCaloriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    loadCaloriesData();
  }, []);

  const loadCaloriesData = async () => {
    try {
      setLoading(true);
      // Fetch calories for popular activities
      const popularActivities = ['running', 'cycling', 'swimming', 'weight training'];
      let allData = [];

      for (const activity of popularActivities) {
        try {
          const data = await FitnessService.getCaloriesBurned(activity, 160, 60);
          console.log(`✅ ${activity}:`, data);
          if (data && data.length > 0) {
            // Take the first result for each activity
            allData.push({
              ...data[0],
              id: `${activity}-${data[0].calories_per_hour}`,
              activityType: activity,
            });
          }
        } catch (actError) {
          console.warn(`⚠️ Failed to fetch ${activity}:`, actError);
          // Continue with next activity if one fails
        }
      }

      console.log('📊 Total activities loaded:', allData.length);
      setCaloriesData(allData);
    } catch (error) {
      console.error('❌ Error loading calories data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityPress = (item) => {
    setSelectedActivity(item.id);
    // Pass the activity name to the details screen
    navigation.navigate('Calories', { 
      activity: item.name // Use the actual activity name from the API
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>🔥 Calories Burned</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Popular activities (1 hour, 160 lbs)</Text>
        </View>
        <TouchableOpacity onPress={loadCaloriesData}>
          <Feather name="refresh-cw" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : caloriesData.length > 0 ? (
        <FlatList
          data={caloriesData}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1
                },
              ]}
              onPress={() => handleActivityPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.leftContent}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Feather name="zap" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.textContent}>
                    <Text style={[styles.activityName, { color: colors.text }]}>
                      {item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name}
                    </Text>
                    <Text style={[styles.duration, { color: colors.muted }]}>
                      {item.duration_minutes} min
                    </Text>
                  </View>
                </View>

                <View style={styles.rightContent}>
                  <View style={[styles.caloriesBadge, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.caloriesValue, { color: colors.primary }]}>
                      {Math.round(item.total_calories)}
                    </Text>
                    <Text style={[styles.caloriesLabel, { color: colors.muted }]}>cal</Text>
                  </View>
                  <Feather name="arrow-right" size={18} color={colors.primary} />
                </View>
              </View>

              {/* Progress bar based on calories */}
              <View style={[styles.progressBar, { backgroundColor: colors.inputBg }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${Math.min((item.total_calories / 500) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={48} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>No data available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 16,
    borderRadius: 12,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
  },
  duration: {
    fontSize: 12,
    marginTop: 4,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  caloriesBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  caloriesValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  caloriesLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
