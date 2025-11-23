import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { setSelectedCategory, saveTip, removeTip } from './wellnessSlice';
import { getTheme } from '../ui/themeColors';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', label: 'All Tips' },
  { id: 'hydration', label: 'Hydration' },
  { id: 'exercise', label: 'Exercise' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'rest', label: 'Rest' },
  { id: 'mindfulness', label: 'Mind' }
];

export default function WellnessTips() {
  const dispatch = useDispatch();
  const { tips, selectedCategory, savedTips } = useSelector(s => s.wellness);
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);
  const [expandedId, setExpandedId] = React.useState(null);

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const isSaved = (tipId) => savedTips.includes(tipId);

  const handleToggleSave = (tip) => {
    if (isSaved(tip.id)) {
      dispatch(removeTip(tip.id));
    } else {
      dispatch(saveTip(tip.id));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="heart" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Wellness Tips</Text>
        </View>
      </View>

      {/* Category Filter */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === item.id ? colors.primary : colors.card,
                borderColor: selectedCategory === item.id ? colors.primary : colors.border
              }
            ]}
            onPress={() => dispatch(setSelectedCategory(item.id))}
          >
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === item.id ? '#fff' : colors.text }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />

      {/* Tips List */}
      <FlatList
        data={filteredTips}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const isTipSaved = isSaved(item.id);
          const isExpanded = expandedId === item.id;

          return (
            <TouchableOpacity
              style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setExpandedId(isExpanded ? null : item.id)}
              activeOpacity={0.7}
            >
              {/* Tip Header */}
              <View style={styles.tipHeader}>
                <View style={[styles.tipIcon, { backgroundColor: item.color + '20' }]}>
                  <Feather name={item.icon} size={20} color={item.color} />
                </View>

                <View style={styles.tipContent}>
                  <Text style={[styles.tipTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.tipCategory, { color: colors.muted }]}>
                    {categories.find(c => c.id === item.category)?.label}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: isTipSaved ? item.color : colors.inputBg }
                  ]}
                  onPress={() => handleToggleSave(item)}
                >
                  <Feather
                    name="bookmark"
                    size={16}
                    color={isTipSaved ? '#fff' : item.color}
                    fill={isTipSaved ? item.color : 'none'}
                  />
                </TouchableOpacity>
              </View>

              {/* Expanded Description */}
              {isExpanded && (
                <View style={styles.tipDescription}>
                  <Text style={[styles.descriptionText, { color: colors.muted }]}>
                    {item.description}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.tipsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryList: {
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipsList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  tipCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  tipCategory: {
    fontSize: 11,
    fontWeight: '500',
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipDescription: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});
