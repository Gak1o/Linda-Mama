import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import GetStartedScreen from './src/components/GetStartedScreen';
import AuthScreen from './src/components/AuthScreen';
import HomePage from './src/components/HomePage';
import JournalScreen from './src/components/JournalScreen';
import JournalManagementScreen from './src/components/JournalManagementScreen';
import AIAssistantScreen from './src/components/AIAssistantScreen';
import AppointmentsScreen from './src/components/AppointmentsScreen';
import ResourcesScreen from './src/components/ResourcesScreen';
import ResourceDetailScreen from './src/components/ResourceDetailScreen';
import { AuthProvider } from './src/auth/AuthContext';
import { JournalProvider } from './src/contexts/JournalContext';
import { CustomTheme } from './src/types/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Modern theme with updated colors
const theme: CustomTheme = {
  colors: {
    primary: '#7C4DFF', // Deep purple
    secondary: '#FF4081', // Pink accent
    tertiary: '#00BFA5', // Teal accent
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#FF5252',
    text: '#263238',
    onSurface: '#263238',
    placeholder: '#B0BEC5',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF4081',
    // Custom colors
    gradientStart: '#7C4DFF',
    gradientEnd: '#448AFF',
    cardBackground: '#F5F5F5',
    success: '#00BFA5',
    warning: '#FFA726',
  },
};

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AI Assistant"
        component={AIAssistantScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="robot" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bookshelf" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack navigator for the main app including screens that aren't in the tab bar
function MainAppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainAppTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="JournalManagement" 
        component={JournalManagementScreen} 
        options={{ 
          title: "Manage Journal",
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      />
      <Stack.Screen 
        name="ResourceDetail" 
        component={ResourceDetailScreen} 
        options={{ 
          title: "Resource",
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <JournalProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="GetStarted" component={GetStartedScreen} />
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen name="MainApp" component={MainAppStack} />
            </Stack.Navigator>
          </NavigationContainer>
        </JournalProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
