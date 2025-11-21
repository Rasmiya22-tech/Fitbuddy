import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from './authSlice';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const RegisterSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector(s => s.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#944545" />
        </TouchableOpacity>
        <Feather name="user-plus" size={60} color="#944545" />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join FitBuddy today</Text>
      </View>

      <Formik
        initialValues={{ username: '', password: '', confirm: '' }}
        validationSchema={RegisterSchema}
        onSubmit={values => dispatch(register({ username: values.username, password: values.password }))}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputWrapper, touched.username && errors.username && styles.inputError]}>
                <Feather name="user" size={20} color="#944545" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Choose a username"
                  placeholderTextColor="#aaa"
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                />
              </View>
              {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, touched.password && errors.password && styles.inputError]}>
                <Feather name="lock" size={20} color="#944545" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#944545" />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputWrapper, touched.confirm && errors.confirm && styles.inputError]}>
                <Feather name="lock" size={20} color="#944545" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showConfirm}
                  onChangeText={handleChange('confirm')}
                  onBlur={handleBlur('confirm')}
                  value={values.confirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Feather name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#944545" />
                </TouchableOpacity>
              </View>
              {touched.confirm && errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}
            </View>

            {error && <Text style={styles.serverError}>{error}</Text>}

            <TouchableOpacity 
              style={[styles.button, styles.primaryButton, status === 'loading' && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="check-circle" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.buttonText}>Register</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.loginPrompt}>Already have an account?</Text>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="log-in" size={18} color="#944545" style={{marginRight: 8}} />
              <Text style={styles.secondaryButtonText}>Back to Login</Text>
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
    backgroundColor: '#f8f8f8',
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
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#944545',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
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
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ddd',
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
    color: '#333',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  serverError: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    padding: 12,
    backgroundColor: '#ffe0e0',
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
  primaryButton: {
    backgroundColor: '#944545',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#944545',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#944545',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginPrompt: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginVertical: 12,
  },
});
