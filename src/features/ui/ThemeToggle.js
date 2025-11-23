import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './themeSlice';
import { getTheme } from './themeColors';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);

  return (
    <View style={{flexDirection:'row',alignItems:'center',margin:10}}>
      <Text style={{marginRight:10,color:colors.text}}>Dark Mode</Text>
      <Switch
        value={!!dark}
        onValueChange={() => dispatch(toggleTheme())}
        trackColor={{ false: '#ccc', true: colors.primary }}
        thumbColor={dark ? '#fff' : '#fff'}
      />
    </View>
  );
}
