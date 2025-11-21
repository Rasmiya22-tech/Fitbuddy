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
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#944545" />
          <TextInput
            style={styles.searchInput}
            placeholder="Exercise name..."
            placeholderTextColor="#aaa"
            value={filters.name}
            onChangeText={(text) => handleFilterChange('name', text)}
            onEndEditing={handleSearch}
          />
          {filters.name ? (
            <TouchableOpacity onPress={() => handleFilterChange('name', '')}>
              <Feather name="x" size={20} color="#944545" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Toggle Button */}
      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={() => setExpandFilters(!expandFilters)}
      >
        <Feather name="filter" size={18} color="#fff" />
        <Text style={styles.filterToggleText}>
          {expandFilters ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>

      {/* Filters Section */}
      {expandFilters && (
        <ScrollView style={styles.filtersContainer} horizontal showsHorizontalScrollIndicator={false}>
          {/* Muscle Group Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Muscle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
              {muscleGroups.map(muscle => (
                <TouchableOpacity
                  key={muscle}
                  style={[
                    styles.filterChip,
                    filters.muscle === muscle && styles.filterChipActive
                  ]}
                  onPress={() => handleFilterChange('muscle', filters.muscle === muscle ? '' : muscle)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.muscle === muscle && styles.filterChipTextActive
                  ]}>
                    {muscle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Difficulty Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Difficulty</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
              {difficultyLevels.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    filters.difficulty === level && styles.filterChipActive
                  ]}
                  onPress={() => handleFilterChange('difficulty', filters.difficulty === level ? '' : level)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.difficulty === level && styles.filterChipTextActive
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Clear Filters */}
          {(filters.name || filters.muscle || filters.difficulty || filters.type) && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Feather name="refresh-cw" size={16} color="#d33" />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Results */}
      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#944545" />
        </View>
      )}

      {status === 'failed' && (
        <View style={styles.centered}>
          <Feather name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>Failed to load exercises</Text>
          <Text style={styles.errorDetail}>{error || 'Please check your connection'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleSearch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'succeeded' && items.length === 0 && (
        <View style={styles.centered}>
          <Feather name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No exercises found</Text>
          <Text style={styles.emptyDetail}>Try adjusting your filters</Text>
        </View>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => item.id || idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.exerciseItem}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{item.title}</Text>
                {item.difficulty && (
                  <View style={[styles.difficultyBadge, getDifficultyColor(item.difficulty)]}>
                    <Text style={styles.difficultyText}>{item.difficulty}</Text>
                  </View>
                )}
              </View>
              {item.muscle && <Text style={styles.exerciseMeta}>💪 {item.muscle}</Text>}
              {item.type && <Text style={styles.exerciseMeta}>🏋️ {item.type}</Text>}
              {item.equipment && <Text style={styles.exerciseMeta}>🔧 {item.equipment}</Text>}
              <Text style={styles.exerciseDescription}>{item.description}</Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
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
    maxHeight: 120,
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
    padding: 12,
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
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
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
