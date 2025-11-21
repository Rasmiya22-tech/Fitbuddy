import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './themeSlice';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const dark = useSelector(s => s.theme.darkMode);

  return (
    <View style={{flexDirection:'row',alignItems:'center',margin:10}}>
      <Text style={{marginRight:10}}>Dark Mode</Text>
      <Switch value={!!dark} onValueChange={() => dispatch(toggleTheme())}/>
    </View>
  );
}
