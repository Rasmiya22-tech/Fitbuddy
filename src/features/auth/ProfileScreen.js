import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './authSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const username = useSelector(s => s.auth.username);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Signed in as: {username || 'Guest'}</Text>
      <Button title="Logout" color="#d33" onPress={() => dispatch(logout())} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:22,fontWeight:'700',marginBottom:12},
  label:{marginBottom:20}
});
