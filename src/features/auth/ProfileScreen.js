import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { persistor } from '../../app/store';
import { logout, updateProfile } from './authSlice';
import { getTheme } from '../ui/themeColors';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const username = useSelector(s => s.auth.username);
  const profilePic = useSelector(s => s.auth.profilePic);
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);
  const [editMode, setEditMode] = React.useState(false);
  const [localName, setLocalName] = React.useState(username || '');

  // Keep local inputs in sync when auth state changes (e.g., after login)
  React.useEffect(() => {
    setLocalName(username || '');
  }, [username]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <View style={{ marginTop: 18 }}>
        {!editMode ? (
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome, {username || 'Guest'}</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.primary }]} onPress={() => setEditMode(true)}>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={{ height: 12 }} />
            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.primary }]} onPress={() => dispatch(logout())}>
              <Text style={[styles.logoutText, { color: colors.primary }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              value={localName}
              onChangeText={setLocalName}
              placeholder="Display name"
              placeholderTextColor={colors.placeholder}
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
              caretColor={colors.primary}
            />
            <View style={{ height: 12 }} />
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={async () => { 
              console.log('saving profile', { localName });
              dispatch(updateProfile({ username: localName }));
              try { 
                await persistor.flush(); 
                console.log('persistor.flush completed');
                Alert.alert('Saved', 'Profile saved locally');
              } catch(e){ console.warn('persist flush failed', e); Alert.alert('Saved', 'Profile saved but persist failed'); }
              setEditMode(false);
            }}>
              <Text style={{ color: colors.surface, fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
            <View style={{ height: 12 }} />
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => { setLocalName(username || ''); setEditMode(false); }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, marginBottom: 12 },
  actionButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  logoutButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  logoutText: { fontWeight: '700' },
});
