import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { addWater, removeWater } from './waterSlice';
import { getTheme } from '../ui/themeColors';

const { width } = Dimensions.get('window');

export default function WaterTracker() {
  const dispatch = useDispatch();
  const water = useSelector(s => s.water);
  const { cups, dailyGoal } = water || { cups: 0, dailyGoal: 8 };
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);
  
  const percentage = (cups / dailyGoal) * 100;
  const isGoalMet = cups >= dailyGoal;
  
  // Water color scheme - adaptive to theme
  const waterColor = dark ? 'rgba(59, 152, 219, 0.9)' : '#3498db';
  const successColor = dark ? 'rgba(39, 174, 96, 0.9)' : '#27ae60';

  const handleAddWater = useCallback(() => {
    try {
      dispatch(addWater());
      console.log('💧 Water added. Current cups:', cups + 1);
    } catch (err) {
      console.error('Error adding water:', err);
      Alert.alert('Error', 'Failed to add water. Please try again.');
    }
  }, [dispatch, cups]);

  const handleRemoveWater = useCallback(() => {
    try {
      if (cups > 0) {
        dispatch(removeWater());
        console.log('💧 Water removed. Current cups:', cups - 1);
      } else {
        Alert.alert('Info', 'No water to remove!');
      }
    } catch (err) {
      console.error('Error removing water:', err);
      Alert.alert('Error', 'Failed to remove water. Please try again.');
    }
  }, [dispatch, cups]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="droplet" size={20} color={waterColor} />
          <Text style={[styles.title, { color: colors.text }]}>Water Intake</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{cups}/{dailyGoal} cups</Text>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.inputBg }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isGoalMet ? successColor : waterColor
            }
          ]} 
        />
      </View>

      {/* Status Text */}
      <Text style={[styles.status, { color: isGoalMet ? successColor : colors.muted }]}>
        {isGoalMet ? '✓ Goal reached!' : `${(dailyGoal - cups)} cups to go`}
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: waterColor }]}
          onPress={handleAddWater}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Water</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.removeButton, { borderColor: waterColor }]}
          onPress={handleRemoveWater}
          activeOpacity={0.7}
        >
          <Feather name="minus" size={22} color={waterColor} />
          <Text style={[styles.removeButtonText, { color: waterColor }]}>Remove</Text>
        </TouchableOpacity>
      </View>

      {/* Cup Indicators */}
      <View style={styles.cupGrid}>
        {Array.from({ length: dailyGoal }).map((_, idx) => (
          <View 
            key={idx}
            style={[
              styles.cup,
              { 
                backgroundColor: idx < cups ? waterColor : colors.inputBg,
                borderColor: idx < cups ? waterColor : colors.border
              }
            ]}
          >
            {idx < cups && <Feather name="droplet" size={16} color="#fff" />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  removeButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  cupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cup: {
    width: (width - 56) / 4,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
