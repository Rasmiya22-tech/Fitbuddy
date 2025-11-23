import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { getTheme } from '../ui/themeColors';
import FitnessService from './FitnessService';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 370;
const isMediumDevice = width < 400;

export default function CaloriesDetailsScreen({ route, navigation }) {
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);
  
  const { activity = 'running' } = route?.params || {};
  
  const [weight, setWeight] = useState('160');
  const [customDuration, setCustomDuration] = useState('60');
  const [caloriesData, setCaloriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FitnessService.getCaloriesBurned(activity, 160, 60);
      console.log('📊 Initial data loaded:', data);
      if (data && data.length > 0) {
        setCaloriesData(data);
      } else {
        setError('No data found for this activity. Try another activity.');
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load calorie data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCalories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate inputs
      const weightNum = parseInt(weight);
      const durationNum = parseInt(customDuration);

      if (isNaN(weightNum) || weightNum < 50 || weightNum > 500) {
        setError('Weight must be between 50 and 500 lbs');
        setLoading(false);
        return;
      }

      if (isNaN(durationNum) || durationNum < 1) {
        setError('Duration must be at least 1 minute');
        setLoading(false);
        return;
      }

      console.log(`🔥 Calculating: ${activity}, Weight: ${weightNum}lbs, Duration: ${durationNum}min`);
      const data = await FitnessService.getCaloriesBurned(activity, weightNum, durationNum);
      
      if (!data || data.length === 0) {
        setError('No results found. Try a different activity or check your inputs.');
        setCaloriesData([]);
      } else {
        setCaloriesData(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error calculating calories:', err);
      setError('Failed to calculate. Please check your connection and try again.');
      setCaloriesData([]);
    } finally {
      setLoading(false);
    }
  };

  const topResult = caloriesData && caloriesData[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - Fixed at top */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Calories Calculator</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Activity Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="zap" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.activityTitle, { color: colors.text }]}>{activity}</Text>
          <Text style={[styles.activitySubtitle, { color: colors.muted }]}>Enter your details below</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
            <Feather name="alert-circle" size={18} color={colors.primary} />
            <Text style={[styles.errorText, { color: colors.primary }]}>{error}</Text>
          </View>
        )}

        {/* Input Controls */}
        <View style={[styles.inputSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Customize Calculation</Text>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Weight (lbs)</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="user" size={18} color={colors.muted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="160"
                placeholderTextColor={colors.placeholder}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                editable={!loading}
              />
              <Text style={[styles.unit, { color: colors.muted }]}>lbs</Text>
            </View>
            <Text style={[styles.hint, { color: colors.muted }]}>Range: 50-500 lbs</Text>
          </View>

          {/* Duration Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.muted }]}>Duration (minutes)</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="clock" size={18} color={colors.muted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="60"
                placeholderTextColor={colors.placeholder}
                value={customDuration}
                onChangeText={setCustomDuration}
                keyboardType="numeric"
                editable={!loading}
              />
              <Text style={[styles.unit, { color: colors.muted }]}>min</Text>
            </View>
            <Text style={[styles.hint, { color: colors.muted }]}>Minimum: 1 minute</Text>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            style={[styles.calculateButton, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
            onPress={calculateCalories}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color={colors.surface} />
                <Text style={[styles.buttonText, { color: colors.surface }]}>Calculating...</Text>
              </>
            ) : (
              <>
                <Feather name="calculator" size={18} color={colors.surface} />
                <Text style={[styles.buttonText, { color: colors.surface }]}>Calculate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Results */}
        {topResult && !loading && (
          <View style={[styles.resultsSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Results</Text>

            {/* Main Stats */}
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Per Hour</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {topResult.calories_per_hour}
                </Text>
                <Text style={[styles.statUnit, { color: colors.muted }]}>kcal</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Total</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {Math.round(topResult.total_calories)}
                </Text>
                <Text style={[styles.statUnit, { color: colors.muted }]}>kcal</Text>
              </View>

              <View style={[styles.statBox, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Duration</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {topResult.duration_minutes}
                </Text>
                <Text style={[styles.statUnit, { color: colors.muted }]}>min</Text>
              </View>
            </View>

            {/* Activity Name */}
            <View style={[styles.resultCard, { backgroundColor: colors.inputBg }]}>
              <Feather name="activity" size={20} color={colors.primary} />
              <View style={styles.resultText}>
                <Text style={[styles.resultLabel, { color: colors.muted }]}>Activity</Text>
                <Text style={[styles.resultValue, { color: colors.text }]}>{topResult.name}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View style={[styles.loadingContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.muted }]}>Loading calorie data...</Text>
          </View>
        )}

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>💡 Tips</Text>
          
          <View style={styles.tip}>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.text }]}>
              More intense activities burn more calories per hour
            </Text>
          </View>

          <View style={styles.tip}>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.text }]}>
              Higher body weight increases calories burned
            </Text>
          </View>

          <View style={styles.tip}>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.text }]}>
              Longer duration = more total calories burned
            </Text>
          </View>

          <View style={styles.tip}>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.text }]}>
              Values are approximate and vary by individual fitness level
            </Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollableContent: {
    flex: 1,
  },
  content: {
    padding: isSmallDevice ? 8 : 12,
    paddingBottom: 100,
  },
  infoCard: {
    borderRadius: 12,
    padding: isSmallDevice ? 14 : 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
  },
  iconContainer: {
    width: isSmallDevice ? 50 : 60,
    height: isSmallDevice ? 50 : 60,
    borderRadius: isSmallDevice ? 25 : 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: isSmallDevice ? 15 : 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
  },
  errorContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  inputSection: {
    borderRadius: 12,
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: isSmallDevice ? 40 : 44,
    borderWidth: 1,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    marginLeft: 6,
    fontSize: isSmallDevice ? 12 : 14,
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
  },
  hint: {
    fontSize: 11,
  },
  calculateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  resultsSection: {
    borderRadius: 12,
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: isSmallDevice ? (width - 50) / 3 : (width - 60) / 3,
    borderRadius: 8,
    padding: isSmallDevice ? 8 : 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: isSmallDevice ? 9 : 11,
    fontWeight: '600',
    marginBottom: 3,
    textAlign: 'center',
  },
  statValue: {
    fontSize: isSmallDevice ? 13 : 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  statUnit: {
    fontSize: 10,
    marginTop: 4,
  },
  resultCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  resultText: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  loadingContainer: {
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  infoSection: {
    borderRadius: 12,
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 32,
    borderWidth: 1,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  tipText: {
    fontSize: isSmallDevice ? 11 : 12,
    flex: 1,
    lineHeight: isSmallDevice ? 16 : 18,
  },
});
