import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MaterialCommunityIcons as MCIType } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the resource type
interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  type: 'article' | 'video' | 'guide';
  content?: string;
}

// Define the param list for the stack navigator
type RootStackParamList = {
  ResourceDetail: { resource: Resource };
  MainTabs: undefined;
  JournalManagement: undefined;
};

// Define the props for this screen using the NativeStackScreenProps utility
type ResourceDetailProps = NativeStackScreenProps<RootStackParamList, 'ResourceDetail'>;

const ResourceDetailScreen = ({ route, navigation }: ResourceDetailProps) => {
  const { resource } = route.params;
  const theme = useTheme();

  // Sample content if none provided
  const defaultContent = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
    nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
    nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.

    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
  `;

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'article':
        return 'file-document-outline';
      case 'video':
        return 'play-circle-outline';
      case 'guide':
        return 'book-open-variant';
      default:
        return 'file-document-outline';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: resource.image }}
        style={styles.headerImage}
      >
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>
            {resource.title}
          </Text>
          <View style={styles.typeContainer}>
            <MaterialCommunityIcons
              name={getTypeIcon(resource.type)}
              size={24}
              color="#fff"
            />
            <Text variant="titleMedium" style={styles.typeText}>
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Overview
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          {resource.description}
        </Text>

        <Text variant="titleLarge" style={[styles.sectionTitle, { marginTop: 24 }]}>
          Content
        </Text>
        <Card style={styles.contentCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.content}>
              {resource.content || defaultContent}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="share-variant"
            style={styles.actionButton}
            onPress={() => {
              // Simple alert to show sharing would happen here
              alert('Sharing functionality would be implemented here');
            }}
          >
            Share
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerImage: {
    height: 250,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    color: '#fff',
    marginLeft: 8,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
  },
  contentCard: {
    marginTop: 8,
    marginBottom: 24,
  },
  content: {
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    marginHorizontal: 8,
    paddingHorizontal: 16,
  },
});

export default ResourceDetailScreen;
