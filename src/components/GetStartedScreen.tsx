import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const GetStartedScreen = ({ navigation }: any) => {
  const theme = useTheme();

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1584582397624-d1c2bff23c56?w=800' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="heart-plus"
            size={80}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <Text variant="displaySmall" style={styles.title}>
            MamaCare
          </Text>
          <Text variant="titleLarge" style={styles.subtitle}>
            Your Pregnancy Journey Companion
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            Track your pregnancy, get expert advice, and connect with a supportive community
          </Text>

          <View style={styles.features}>
            <Feature icon="calendar-check" text="Track Your Progress" />
            <Feature icon="book-open-variant" text="Daily Pregnancy Journal" />
            <Feature icon="robot" text="24/7 AI Assistant" />
          </View>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Auth')}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Get Started
          </Button>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const Feature = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <MaterialCommunityIcons name={icon} size={24} color="#fff" />
    <Text variant="bodyMedium" style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 32,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    color: '#fff',
    marginLeft: 12,
    opacity: 0.9,
  },
  button: {
    width: '100%',
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen; 