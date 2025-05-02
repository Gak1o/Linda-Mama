import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../auth/AuthContext';

const AuthScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    dueDate?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      name?: string;
      dueDate?: string;
    } = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Name validation (only for registration)
    if (!isLogin && !name) {
      newErrors.name = 'Name is required';
    }
    
    // Due date validation (optional but must be valid if provided)
    if (!isLogin && dueDate && !/^\d{2}\/\d{2}\/\d{4}$/.test(dueDate)) {
      newErrors.dueDate = 'Due date must be in MM/DD/YYYY format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (isLogin) {
      const success = await login({ email, password });
      if (success) {
        navigation.replace('MainApp');
      }
    } else {
      const success = await register({ name, email, password, dueDate });
      if (success) {
        navigation.replace('MainApp');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="heart-plus"
              size={64}
              color="#fff"
              style={styles.icon}
            />
            <Text variant="headlineMedium" style={styles.title}>
              Welcome to MamaCare
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </Text>
          </View>

          <Surface style={styles.formContainer}>
            {!isLogin && (
              <>
                <TextInput
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="account" />}
                  error={!!errors.name}
                  disabled={loading}
                />
                {errors.name && <HelperText type="error">{errors.name}</HelperText>}
              </>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
              error={!!errors.email}
              disabled={loading}
            />
            {errors.email && <HelperText type="error">{errors.email}</HelperText>}

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              left={<TextInput.Icon icon="lock" />}
              error={!!errors.password}
              disabled={loading}
            />
            {errors.password && <HelperText type="error">{errors.password}</HelperText>}

            {!isLogin && (
              <>
                <TextInput
                  label="Expected Due Date"
                  value={dueDate}
                  onChangeText={setDueDate}
                  mode="outlined"
                  style={styles.input}
                  placeholder="MM/DD/YYYY"
                  left={<TextInput.Icon icon="calendar" />}
                  error={!!errors.dueDate}
                  disabled={loading}
                />
                {errors.dueDate && <HelperText type="error">{errors.dueDate}</HelperText>}
              </>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              contentStyle={styles.buttonContent}
              disabled={loading}
              loading={loading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            <Button
              mode="text"
              onPress={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              style={styles.switchButton}
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Button>
          </Surface>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  switchButton: {
    marginTop: 16,
  },
});

export default AuthScreen;