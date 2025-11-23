import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './authSlice';
import { Feather } from '@expo/vector-icons';
import { getTheme } from '../ui/themeColors';

const { width, height } = Dimensions.get('window');

const LoginSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector(s => s.auth);
  const dark = useSelector(s => s.theme.darkMode);
  const colors = getTheme(dark);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Feather name="activity" size={60} color={colors.primary} />
        <Text style={[styles.appName, { color: colors.primary }]}>FitBuddy</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Track your fitness journey</Text>
      </View>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={values => dispatch(login(values))}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          
          // ✔ backgroundColor removed (no more white block)
          <View style={styles.formContainer}>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Username</Text>
              
              <View 
                style={[
                  styles.inputWrapper, 
                  { backgroundColor: colors.inputBg, borderColor: colors.border }, 
                  touched.username && errors.username && styles.inputError
                ]}
              >
                <Feather name="user" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.placeholder}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                />
              </View>

              {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>

              <View 
                style={[
                  styles.inputWrapper, 
                  { backgroundColor: colors.inputBg, borderColor: colors.border }, 
                  touched.password && errors.password && styles.inputError
                ]}
              >
                <Feather name="lock" size={20} color={colors.primary} style={styles.inputIcon} />
                
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />

                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {error && (
              <Text style={[styles.serverError, { backgroundColor: colors.dangerBg, color: colors.text }]}>
                {error}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }, status === 'loading' && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.muted }]}>New here?</Text>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity 
              style={[
                styles.button, 
                { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary }, 
                status === 'loading' && styles.buttonDisabled
              ]} 
              onPress={() => navigation.navigate('Register')}
            >
              <Feather name="user-plus" size={18} color={colors.primary} style={{marginRight: 8}} />
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    minHeight: height,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  serverError: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
  },
});
