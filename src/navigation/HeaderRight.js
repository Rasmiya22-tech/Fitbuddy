import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/ui/themeSlice';
import { Feather } from '@expo/vector-icons';
import { getTheme } from '../features/ui/themeColors';

export default function HeaderRight({ username }) {
  const dispatch = useDispatch();
  const isDark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(isDark);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 12, gap: 12}}>
      <Text style={{fontSize: 14, fontWeight: '600', color: colors.text, maxWidth: 100}}>
        {username}
      </Text>
      <TouchableOpacity 
        onPress={() => dispatch(toggleTheme())}
        style={{padding: 6}}
      >
        <Feather 
          name={isDark ? 'sun' : 'moon'} 
          size={22} 
          color={colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
}
