import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import ExerciseCard from '../exercises/ExerciseCard';
import { getTheme } from '../ui/themeColors';

const { width } = Dimensions.get('window');

export default function FavouritesScreen({ navigation }) {
  const items = useSelector(s => s.favourites.items);
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);

  const handlePress = (item) => {
    navigation.navigate('Details', { item });
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContent}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="heart" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Workouts</Text>
          <Text style={[styles.emptyMessage, { color: colors.muted }]}>
            Start saving your favorite exercises to quick access them later
          </Text>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Feather name="zap" size={18} color="#fff" />
            <Text style={styles.exploreButtonText}>Explore Workouts</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Workouts</Text>
        <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{items.length}</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => (
          <ExerciseCard 
            item={item} 
            onPress={() => handlePress(item)}
            showFavButton={true}
          />
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  exploreButton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
