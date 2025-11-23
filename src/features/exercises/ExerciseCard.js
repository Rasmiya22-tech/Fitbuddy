import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addFavourite, removeFavourite } from '../favourites/favouritesSlice';
import { getTheme } from '../ui/themeColors';

const { width } = Dimensions.get('window');

export default function ExerciseCard({ item, onPress, showFavButton = true }) {
  if (!item) return null;
  
  const dispatch = useDispatch();
  const favs = useSelector(s => s.favourites.items);
  const isFav = favs.some(f => f.id === item.id);
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);

  // Get icon based on muscle target
  const getMuscleIcon = (muscle) => {
    const icons = {
      chest: 'box',
      back: 'arrow-left',
      lats: 'arrow-left',
      legs: 'arrow-down',
      quadriceps: 'arrow-down',
      hamstrings: 'arrow-down',
      glutes: 'arrow-down',
      shoulders: 'arrow-up-right',
      biceps: 'arrow-left',
      triceps: 'arrow-right',
      abs: 'layers',
    };
    return icons[muscle] || 'zap';
  };

  // Get color based on difficulty
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#27ae60',
      easy: '#27ae60',
      intermediate: '#f39c12',
      advanced: '#e74c3c'
    };
    return colors[difficulty] || '#95a5a6';
  };

  const handleFavToggle = (e) => {
    e.stopPropagation();
    if (isFav) {
      dispatch(removeFavourite(item.id));
    } else {
      dispatch(addFavourite(item));
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {/* Icon and Basic Info */}
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Feather name={getMuscleIcon(item.muscle)} size={24} color={colors.primary} />
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text numberOfLines={2} style={[styles.description, { color: colors.muted }]}>
            {item.description}
          </Text>
          
          {/* Difficulty Badge */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
              <Text style={[styles.badgeText, { color: getDifficultyColor(item.difficulty) }]}>
                {item.status}
              </Text>
            </View>
            {item.equipment && (
              <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {item.equipment.split(',')[0]}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Favorite Button */}
      {showFavButton && (
        <TouchableOpacity 
          style={[styles.favButton, { backgroundColor: isFav ? colors.primary : colors.surface }]}
          onPress={handleFavToggle}
        >
          <Feather 
            name={isFav ? 'heart' : 'heart'} 
            size={18} 
            color={isFav ? '#fff' : colors.primary}
            fill={isFav ? colors.primary : 'none'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    margin: 10,
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  }
});
