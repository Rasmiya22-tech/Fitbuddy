import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { addFavourite, removeFavourite } from '../favourites/favouritesSlice';
import { getTheme } from '../ui/themeColors';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 370;
const isMediumDevice = width < 400;

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const dispatch = useDispatch();
  const favs = useSelector(s => s.favourites.items);
  const isFav = favs.some(f => f.id === item.id);
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);

  const handleFavToggle = () => {
    if (isFav) {
      dispatch(removeFavourite(item.id));
    } else {
      dispatch(addFavourite(item));
    }
  };

  const getMuscleIcon = (muscle) => {
    const icons = {
      chest: 'heart',
      back: 'arrow-left',
      lats: 'arrow-left',
      legs: 'arrow-down',
      quadriceps: 'arrow-down',
      hamstrings: 'arrow-down',
      glutes: 'arrow-down',
      shoulders: 'arrow-up',
      biceps: 'arrow-left',
      triceps: 'arrow-right',
    };
    return icons[muscle] || 'zap';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#27ae60',
      easy: '#27ae60',
      intermediate: '#f39c12',
      advanced: '#e74c3c'
    };
    return colors[difficulty] || '#95a5a6';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with icon */}
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Feather name={getMuscleIcon(item.muscle)} size={48} color={colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{item.description}</Text>

          {/* Badges */}
          <View style={styles.badgesContainer}>
            <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
              <Feather name="zap" size={14} color={getDifficultyColor(item.difficulty)} />
              <Text style={[styles.badgeText, { color: getDifficultyColor(item.difficulty) }]}>
                {item.status}
              </Text>
            </View>
            {item.equipment && (
              <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                <Feather name="tool" size={14} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {item.equipment.split(',')[0]}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Details Section */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercise Details</Text>
          
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={styles.detailLabel}>
              <Feather name="target" size={20} color={colors.primary} />
              <Text style={[styles.detailLabelText, { color: colors.text }]}>Target Muscle</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.muted }]}>
              {item.muscle?.charAt(0).toUpperCase() + item.muscle?.slice(1) || 'N/A'}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={styles.detailLabel}>
              <Feather name="bar-chart-2" size={20} color={colors.primary} />
              <Text style={[styles.detailLabelText, { color: colors.text }]}>Difficulty</Text>
            </View>
            <Text style={[styles.detailValue, { color: getDifficultyColor(item.difficulty) }]}>
              {item.status}
            </Text>
          </View>

          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={styles.detailLabel}>
              <Feather name="type" size={20} color={colors.primary} />
              <Text style={[styles.detailLabelText, { color: colors.text }]}>Exercise Type</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.muted }]}>
              {item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Feather name="tool" size={20} color={colors.primary} />
              <Text style={[styles.detailLabelText, { color: colors.text }]}>Equipment</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.muted }]}>
              {item.equipment || 'No equipment'}
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About This Exercise</Text>
          <Text style={[styles.descriptionText, { color: colors.muted }]}>
            {item.description}
          </Text>
        </View>

        {/* Tips Section */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Training Tips</Text>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={18} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.muted }]}>Start with proper form before increasing weight</Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={18} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.muted }]}>Control the movement and avoid momentum</Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={18} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.muted }]}>Take adequate rest between sets</Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={18} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.muted }]}>Warm up before starting your workout</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Button */}
      <View style={[styles.buttonContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.favButton, { 
            backgroundColor: isFav ? colors.primary : colors.surface,
            borderColor: colors.primary,
            borderWidth: 1.5
          }]}
          onPress={handleFavToggle}
        >
          <Feather 
            name="heart" 
            size={24} 
            color={isFav ? '#fff' : colors.primary}
            fill={isFav ? colors.primary : 'none'}
          />
          <Text style={[
            styles.buttonText,
            { color: isFav ? '#fff' : colors.primary }
          ]}>
            {isFav ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isSmallDevice ? 8 : 12,
    paddingTop: 12,
  },
  headerCard: {
    borderRadius: 14,
    padding: isSmallDevice ? 14 : 20,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: isSmallDevice ? 60 : 80,
    height: isSmallDevice ? 60 : 80,
    borderRadius: isSmallDevice ? 30 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: isSmallDevice ? 20 : isMediumDevice ? 23 : 26,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    borderRadius: 12,
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabelText: {
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: isSmallDevice ? 11 : 13,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: isSmallDevice ? 8 : 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  favButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '700',
  },
});
