import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../ui/themeColors';
import { searchExercises, setFilters, clearFilters, getExercisesByMuscle } from './fitnessExercisesSlice';
import FitnessService from './FitnessService';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ExercisesListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, status, error, filters } = useSelector(s => s.fitnessExercises);
  const [expandFilters, setExpandFilters] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);

  useEffect(() => {
    // Load filter options
    const loadFilterOptions = async () => {
      const muscles = await FitnessService.getMuscleGroups();
      const types = await FitnessService.getExerciseTypes();
      const difficulties = await FitnessService.getDifficultyLevels();
      setMuscleGroups(muscles);
      setExerciseTypes(types);
      setDifficultyLevels(difficulties);
    };
    loadFilterOptions();
    
    // Initial load - popular exercises
    dispatch(getExercisesByMuscle('biceps'));
  }, [dispatch]);

  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);

  const handleSearch = () => {
    dispatch(searchExercises(filters));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(getExercisesByMuscle('biceps'));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.searchHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.inputBg }] }>
          <Feather name="search" size={20} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Exercise name..."
            placeholderTextColor={colors.placeholder}
            value={filters.name}
            onChangeText={(text) => handleFilterChange('name', text)}
            onEndEditing={handleSearch}
          />
          {filters.name ? (
            <TouchableOpacity onPress={() => handleFilterChange('name', '')}>
              <Feather name="x" size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Toggle Button */}
      <TouchableOpacity 
        style={[styles.filterToggle, { backgroundColor: colors.primary }]}
        onPress={() => setExpandFilters(!expandFilters)}
      >
        <Feather name="filter" size={18} color={colors.surface} />
        <Text style={[styles.filterToggleText, { color: colors.surface }]}>
          {expandFilters ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>

      {/* Filters Section */}
      {expandFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.filtersContent}>
            {/* Muscle Group Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>💪 Muscle Group</Text>
              <View style={styles.muscleGrid}>
                {muscleGroups.map(muscle => (
                  <TouchableOpacity
                    key={muscle}
                    style={[
                      styles.muscleLargeChip,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      filters.muscle === muscle && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => handleFilterChange('muscle', filters.muscle === muscle ? '' : muscle)}
                  >
                    <Text style={[
                      styles.muscleLargeChipText,
                      { color: colors.text },
                      filters.muscle === muscle && { color: colors.surface }
                    ]}>
                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Difficulty Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>🎯 Difficulty</Text>
              <View style={styles.difficultyGrid}>
                {difficultyLevels.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.difficultyLargeChip,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      filters.difficulty === level && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => handleFilterChange('difficulty', filters.difficulty === level ? '' : level)}
                  >
                    <Text style={[
                      styles.difficultyLargeChipText,
                      { color: colors.text },
                      filters.difficulty === level && { color: colors.surface }
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Type Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>🏋️ Exercise Type</Text>
              <View style={styles.typeGrid}>
                {exerciseTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeLargeChip,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      filters.type === type && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => handleFilterChange('type', filters.type === type ? '' : type)}
                  >
                    <Text style={[
                      styles.typeLargeChipText,
                      { color: colors.text },
                      filters.type === type && { color: colors.surface }
                    ]}>
                      {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Clear Filters Button */}
            {(filters.name || filters.muscle || filters.difficulty || filters.type) && (
              <TouchableOpacity 
                style={[styles.clearAllButton, { backgroundColor: colors.primary }]} 
                onPress={handleClearFilters}
              >
                <Feather name="refresh-cw" size={18} color={colors.surface} />
                <Text style={[styles.clearAllButtonText, { color: colors.surface }]}>Clear All Filters</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {/* Results */}
      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {status === 'failed' && (
        <View style={styles.centered}>
          <Feather name="alert-circle" size={48} color={colors.primary} />
          <Text style={[styles.errorText, { color: colors.text }]}>Failed to load exercises</Text>
          <Text style={[styles.errorDetail, { color: colors.muted }]}>{error || 'Please check your connection'}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={handleSearch}>
            <Text style={[styles.retryButtonText, { color: colors.surface }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'succeeded' && items.length === 0 && (
        <View style={styles.centered}>
          <Feather name="inbox" size={48} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>No exercises found</Text>
          <Text style={[styles.emptyDetail, { color: colors.muted }]}>Try adjusting your filters</Text>
        </View>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <FlatList
          data={items}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={(item, idx) => item.id || idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Details', { item })}
              activeOpacity={0.85}
            >
              {/* Muscle Indicator */}
              <View style={[styles.muscleIndicator, { backgroundColor: colors.primary + '20' }]}>
                <Feather name="zap" size={20} color={colors.primary} />
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                {/* Difficulty Badge */}
                {item.difficulty && (
                  <View style={[styles.badgeRow]}>
                    <View style={[styles.difficultyBadge, getDifficultyBadgeColor(item.difficulty, colors)]}>
                      <Text style={[styles.difficultyText, { color: getDifficultyTextColor(item.difficulty) }]}>
                        {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Title */}
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                  {item.title}
                </Text>

                {/* Muscle Info */}
                {item.muscle && (
                  <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>
                    💪 {item.muscle}
                  </Text>
                )}

                {/* Type Info */}
                {item.type && (
                  <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>
                    🏋️ {item.type}
                  </Text>
                )}

                {/* Equipment Info */}
                {item.equipment && (
                  <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>
                    🔧 {item.equipment}
                  </Text>
                )}

                {/* View Button */}
                <TouchableOpacity 
                  style={[styles.cardButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('Details', { item })}
                >
                  <Text style={[styles.cardButtonText, { color: colors.surface }]}>Details</Text>
                  <Feather name="arrow-right" size={14} color={colors.surface} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No results</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const getDifficultyBadgeColor = (difficulty, colors) => {
  const difficultyColors = {
    beginner: { backgroundColor: '#d4edda' },
    easy: { backgroundColor: '#d4edda' },
    intermediate: { backgroundColor: '#fff3cd' },
    advanced: { backgroundColor: '#f8d7da' },
    expert: { backgroundColor: '#f8d7da' }
  };
  return difficultyColors[difficulty] || { backgroundColor: colors.inputBg };
};

const getDifficultyTextColor = (difficulty) => {
  const textColors = {
    beginner: '#155724',
    easy: '#155724',
    intermediate: '#856404',
    advanced: '#721c24',
    expert: '#721c24'
  };
  return textColors[difficulty] || '#333';
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: { backgroundColor: '#d4edda' },
    intermediate: { backgroundColor: '#fff3cd' },
    expert: { backgroundColor: '#f8d7da' }
  };
  return colors[difficulty] || { backgroundColor: '#e2e3e5' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchHeader: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#944545',
    paddingVertical: 10,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  filterToggleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 450,
  },
  filtersContent: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleLargeChip: {
    width: (width - 40) / 3,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  muscleLargeChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  difficultyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  difficultyLargeChip: {
    width: (width - 40) / 3,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  difficultyLargeChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeLargeChip: {
    width: (width - 40) / 2.5,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeLargeChipText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
    gap: 6,
  },
  clearAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  filterGroup: {
    marginRight: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: '#944545',
    borderColor: '#944545',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffe0e0',
    gap: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#d33',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
    marginTop: 12,
  },
  emptyDetail: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 4,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#944545',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 4,
  },
  exerciseCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    elevation: 3,
    minHeight: 320,
  },
  muscleIndicator: {
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  badgeRow: {
    marginBottom: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  cardMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#944545',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  cardButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  exerciseItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#944545',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  exerciseMeta: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
  exerciseDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
    marginVertical: 8,
  },
  detailsButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  detailsButtonText: {
    fontSize: 13,
    color: '#944545',
    fontWeight: '600',
    textAlign: 'center',
  },
});
