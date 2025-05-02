import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar, Card, useTheme } from 'react-native-paper';
import { useAuth } from '../auth/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileSection = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigate back to the auth screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'GetStarted' }],
    });
  };

  if (!user) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={60}
            label={getInitials(user.name)}
            style={styles.avatar}
            color="#fff"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
        </View>
        <View style={styles.userInfo}>
          <Text variant="titleLarge" style={styles.name}>
            {user.name}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user.email}
          </Text>
          {user.dueDate && (
            <View style={styles.dueDateContainer}>
              <MaterialCommunityIcons
                name="calendar-heart"
                size={16}
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium" style={styles.dueDate}>
                Due Date: {user.dueDate}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => {
            // Navigate to profile edit screen (to be implemented)
            // navigation.navigate('EditProfile');
          }}
          style={styles.editButton}
          icon="account-edit"
        >
          Edit Profile
        </Button>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor={theme.colors.error}
          icon="logout"
        >
          Logout
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    backgroundColor: '#7C4DFF',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    opacity: 0.7,
    marginBottom: 8,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    marginLeft: 6,
    opacity: 0.8,
  },
  actions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  logoutButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ProfileSection;
