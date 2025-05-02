import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, Card, useTheme, IconButton } from 'react-native-paper';
import { useAuth } from '../auth/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CustomTheme } from '../types/theme';

interface ProfileModalProps {
  visible: boolean;
  onDismiss: () => void;
  navigation: any;
}

const ProfileModal = ({ visible, onDismiss, navigation }: ProfileModalProps) => {
  const theme = useTheme() as CustomTheme;
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onDismiss();
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
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.dismissArea} 
          activeOpacity={1} 
          onPress={onDismiss}
        />
        <View style={styles.modalContainer}>
          <Card style={styles.card}>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
            <Card.Content style={styles.content}>
              <View style={styles.avatarContainer}>
                <Avatar.Text
                  size={80}
                  label={getInitials(user.name)}
                  style={styles.avatar}
                  color="#fff"
                  theme={{ colors: { primary: theme.colors.primary } }}
                />
              </View>
              <View style={styles.userInfo}>
                <Text variant="headlineSmall" style={styles.name}>
                  {user.name}
                </Text>
                <Text variant="bodyLarge" style={styles.email}>
                  {user.email}
                </Text>
                {user.dueDate && (
                  <View style={styles.dueDateContainer}>
                    <MaterialCommunityIcons
                      name="calendar-heart"
                      size={18}
                      color={theme.colors.primary}
                    />
                    <Text variant="bodyLarge" style={styles.dueDate}>
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
                  onDismiss();
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    borderRadius: 12,
    position: 'relative',
    elevation: 0,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 4,
    top: 4,
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingTop: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#7C4DFF',
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    opacity: 0.7,
    marginBottom: 12,
    textAlign: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dueDate: {
    marginLeft: 8,
    opacity: 0.8,
  },
  actions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
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

export default ProfileModal;
