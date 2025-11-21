import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/ui/themeSlice';
import { Feather } from '@expo/vector-icons';

export default function HeaderRight({ username }) {
  const dispatch = useDispatch();
  const isDark = useSelector(s => s.theme.darkMode);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 12, gap: 12}}>
      <Text style={{fontSize: 14, fontWeight: '600', color: isDark ? '#fff' : '#333', maxWidth: 100}}>
        {username}
      </Text>
      <TouchableOpacity 
        onPress={() => dispatch(toggleTheme())}
        style={{padding: 6}}
      >
        <Feather 
          name={isDark ? 'sun' : 'moon'} 
          size={22} 
          color={isDark ? '#ffd700' : '#333'} 
        />
      </TouchableOpacity>
    </View>
  );
}
