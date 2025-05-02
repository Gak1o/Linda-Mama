import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  dueDate?: string;
  createdAt: string;
}

// Define user credentials interface
export interface UserCredentials {
  email: string;
  password: string;
}

// Define registration data interface
export interface RegistrationData extends UserCredentials {
  name: string;
  dueDate?: string;
}

// Storage keys
const USER_STORAGE_KEY = '@MamaCare:users';
const AUTH_TOKEN_KEY = '@MamaCare:authToken';
const CURRENT_USER_KEY = '@MamaCare:currentUser';

/**
 * Register a new user
 */
export const registerUser = async (userData: RegistrationData): Promise<User | null> => {
  try {
    // Get existing users or initialize empty array
    const existingUsersJSON = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const existingUsers: User[] = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];
    
    // Check if email already exists
    const emailExists = existingUsers.some(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) {
      Alert.alert('Registration Failed', 'An account with this email already exists.');
      return null;
    }
    
    // Create new user object
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      dueDate: userData.dueDate,
      createdAt: new Date().toISOString()
    };
    
    // Store user credentials separately (with password)
    const userCredentials = {
      email: userData.email.toLowerCase(),
      password: userData.password,
      userId: newUser.id
    };
    
    // Update users list
    const updatedUsers = [...existingUsers, newUser];
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUsers));
    
    // Store user credentials
    const credentialsKey = `@MamaCare:credentials:${newUser.id}`;
    await AsyncStorage.setItem(credentialsKey, JSON.stringify(userCredentials));
    
    // Set current user and generate auth token
    await setCurrentUser(newUser);
    
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    Alert.alert('Registration Failed', 'An error occurred during registration. Please try again.');
    return null;
  }
};

/**
 * Login a user
 */
export const loginUser = async (credentials: UserCredentials): Promise<User | null> => {
  try {
    // Get existing users
    const existingUsersJSON = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (!existingUsersJSON) {
      Alert.alert('Login Failed', 'No registered users found.');
      return null;
    }
    
    const existingUsers: User[] = JSON.parse(existingUsersJSON);
    
    // Find user by email
    const user = existingUsers.find(user => user.email.toLowerCase() === credentials.email.toLowerCase());
    if (!user) {
      Alert.alert('Login Failed', 'Invalid email or password.');
      return null;
    }
    
    // Get user credentials to verify password
    const credentialsKey = `@MamaCare:credentials:${user.id}`;
    const userCredentialsJSON = await AsyncStorage.getItem(credentialsKey);
    
    if (!userCredentialsJSON) {
      Alert.alert('Login Failed', 'User credentials not found.');
      return null;
    }
    
    const userCredentials = JSON.parse(userCredentialsJSON);
    
    // Verify password
    if (userCredentials.password !== credentials.password) {
      Alert.alert('Login Failed', 'Invalid email or password.');
      return null;
    }
    
    // Set current user and generate auth token
    await setCurrentUser(user);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
    return null;
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    // Remove auth token and current user
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const currentUserJSON = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserJSON) return null;
    
    return JSON.parse(currentUserJSON);
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const authToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const currentUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
    
    return !!authToken && !!currentUser;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

/**
 * Set current user and generate auth token
 */
const setCurrentUser = async (user: User): Promise<void> => {
  // Generate simple auth token (in a real app, use a more secure method)
  const authToken = `token_${user.id}_${Date.now()}`;
  
  // Store auth token and current user
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken);
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updatedData: Partial<User>): Promise<User | null> => {
  try {
    // Get existing users
    const existingUsersJSON = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (!existingUsersJSON) return null;
    
    const existingUsers: User[] = JSON.parse(existingUsersJSON);
    
    // Find and update user
    const updatedUsers = existingUsers.map(user => {
      if (user.id === userId) {
        return { ...user, ...updatedData };
      }
      return user;
    });
    
    // Store updated users
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUsers));
    
    // Update current user if it's the logged-in user
    const currentUserJSON = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (currentUserJSON) {
      const currentUser: User = JSON.parse(currentUserJSON);
      if (currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updatedData };
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    
    // Return updated user
    const updatedUser = updatedUsers.find(user => user.id === userId);
    return updatedUser || null;
  } catch (error) {
    console.error('Update user profile error:', error);
    return null;
  }
};
