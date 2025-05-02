import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, IconButton, Checkbox, Button, useTheme, Divider, FAB, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useJournal, JournalEntry } from '../contexts/JournalContext';

const JournalManagementScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { entries, deleteEntry } = useJournal();
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const toggleEntrySelection = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedEntries([]);
  };

  const selectAll = () => {
    if (selectedEntries.length === entries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(entries.map(entry => entry.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedEntries.length === 0) {
      setSnackbarMessage('No entries selected');
      setSnackbarVisible(true);
      return;
    }

    Alert.alert(
      "Delete Journal Entries",
      `Are you sure you want to delete ${selectedEntries.length} selected ${selectedEntries.length === 1 ? 'entry' : 'entries'}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            selectedEntries.forEach(id => deleteEntry(id));
            setSnackbarMessage(`Deleted ${selectedEntries.length} ${selectedEntries.length === 1 ? 'entry' : 'entries'}`);
            setSnackbarVisible(true);
            setSelectedEntries([]);
            if (entries.length === selectedEntries.length) {
              setSelectMode(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteSingle = (id: string) => {
    Alert.alert(
      "Delete Journal Entry",
      "Are you sure you want to delete this journal entry?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            deleteEntry(id);
            setSnackbarMessage('Entry deleted');
            setSnackbarVisible(true);
          },
          style: "destructive"
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMoodIcon = (mood: string): any => {
    const moodIcons: Record<string, string> = {
      'happy': 'emoticon-happy',
      'excited': 'emoticon-excited',
      'neutral': 'emoticon-neutral',
      'sad': 'emoticon-sad',
      'unwell': 'emoticon-sick'
    };
    return moodIcons[mood] || 'emoticon-neutral';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="titleLarge" style={styles.title}>Manage Journal</Text>
          <IconButton
            icon={selectMode ? "close" : "checkbox-multiple-marked-outline"}
            size={24}
            onPress={toggleSelectMode}
          />
        </View>
        {selectMode && (
          <View style={styles.selectionControls}>
            <Button
              mode="text"
              onPress={selectAll}
              style={styles.selectionButton}
            >
              {selectedEntries.length === entries.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              mode="text"
              onPress={handleDeleteSelected}
              textColor={theme.colors.error}
              style={styles.selectionButton}
              disabled={selectedEntries.length === 0}
            >
              Delete Selected
            </Button>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="book-open-page-variant" size={64} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.emptyStateTitle}>No Journal Entries</Text>
            <Text variant="bodyMedium" style={styles.emptyStateText}>
              Start documenting your pregnancy journey by adding your first journal entry.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Journal')}
              style={styles.addButton}
            >
              Add Entry
            </Button>
          </View>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} style={styles.card} mode="elevated">
              <Card.Content>
                <View style={styles.entryHeader}>
                  <View style={styles.titleContainer}>
                    {selectMode ? (
                      <Checkbox
                        status={selectedEntries.includes(entry.id) ? 'checked' : 'unchecked'}
                        onPress={() => toggleEntrySelection(entry.id)}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={getMoodIcon(entry.mood)}
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                    <Text variant="titleMedium" style={styles.entryTitle}>
                      {entry.title}
                    </Text>
                  </View>
                  <View style={styles.entryActions}>
                    <Text variant="bodySmall" style={styles.date}>
                      {formatDate(entry.date)}
                    </Text>
                    {!selectMode && (
                      <IconButton
                        icon="delete-outline"
                        size={20}
                        onPress={() => handleDeleteSingle(entry.id)}
                      />
                    )}
                  </View>
                </View>
                <Text 
                  variant="bodyMedium" 
                  style={styles.content}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {entry.content}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Journal')}
        color="#fff"
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  selectionControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  selectionButton: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  entryTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#666',
    marginRight: 8,
  },
  content: {
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    marginTop: 16,
  },
});

export default JournalManagementScreen;
