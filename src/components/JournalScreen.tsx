import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, FAB, Button, TextInput, useTheme, Portal, Modal, IconButton, Chip, Menu, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useJournal, JournalEntry } from '../contexts/JournalContext';

// Define valid icon names to fix TypeScript errors
type IconName = 
  | 'emoticon-happy' 
  | 'emoticon-excited' 
  | 'emoticon-neutral' 
  | 'emoticon-sad' 
  | 'emoticon-sick'
  | 'star'
  | 'medical-bag'
  | 'heart'
  | 'calendar'
  | 'thought-bubble'
  | 'tag'
  | 'dots-vertical'
  | 'pencil'
  | 'delete'
  | 'plus'
  | 'book-open-page-variant'
  | 'cog-outline';

const JournalScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  
  // State for modal and form
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  
  // State for filtering
  const [filterMood, setFilterMood] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // State for entry menu
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  type MoodType = 'happy' | 'excited' | 'neutral' | 'sad' | 'unwell';
  type CategoryType = 'milestones' | 'symptoms' | 'wellness' | 'appointments' | 'thoughts';
  
  interface Mood {
    icon: IconName;
    label: string;
    value: MoodType;
  }
  
  interface Category {
    label: string;
    value: CategoryType;
    icon: IconName;
  }

  const moods: Mood[] = [
    { icon: 'emoticon-happy', label: 'Happy', value: 'happy' },
    { icon: 'emoticon-excited', label: 'Excited', value: 'excited' },
    { icon: 'emoticon-neutral', label: 'Neutral', value: 'neutral' },
    { icon: 'emoticon-sad', label: 'Sad', value: 'sad' },
    { icon: 'emoticon-sick', label: 'Unwell', value: 'unwell' }
  ];

  const categories: Category[] = [
    { label: 'Milestones', value: 'milestones', icon: 'star' },
    { label: 'Symptoms', value: 'symptoms', icon: 'medical-bag' },
    { label: 'Wellness', value: 'wellness', icon: 'heart' },
    { label: 'Appointments', value: 'appointments', icon: 'calendar' },
    { label: 'Thoughts', value: 'thoughts', icon: 'thought-bubble' }
  ];

  const getMoodIcon = (mood: string): IconName => {
    const foundMood = moods.find(m => m.value === mood);
    return foundMood ? foundMood.icon : 'emoticon-neutral';
  };

  const getCategoryLabel = (categoryValue: string | undefined) => {
    if (!categoryValue) return '';
    const foundCategory = categories.find(c => c.value === categoryValue);
    return foundCategory ? foundCategory.label : '';
  };

  const getCategoryIcon = (categoryValue: string | undefined): IconName => {
    if (!categoryValue) return 'tag';
    const foundCategory = categories.find(c => c.value === categoryValue);
    return foundCategory ? foundCategory.icon : 'tag';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleOpenEntryMenu = (entryId: string, x: number, y: number) => {
    setActiveEntryId(entryId);
    setMenuPosition({ x, y });
    setMenuVisible(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedMood(entry.mood);
    setSelectedCategory(entry.category || '');
    setEditingEntryId(entry.id);
    setVisible(true);
    setMenuVisible(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this journal entry? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteEntry(entryId);
            setMenuVisible(false);
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim() || !selectedMood) {
      Alert.alert("Missing Information", "Please fill in all required fields (title, content, and mood).");
      return;
    }

    const entryData = {
      title,
      content,
      mood: selectedMood,
      date: new Date(),
      category: selectedCategory || undefined
    };

    if (editingEntryId) {
      updateEntry({
        ...entryData,
        id: editingEntryId,
      });
    } else {
      addEntry(entryData);
    }

    // Reset form
    resetForm();
    setVisible(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedMood('');
    setSelectedCategory('');
    setEditingEntryId(null);
  };

  const filteredEntries = entries.filter(entry => {
    let matchesMood = true;
    let matchesCategory = true;

    if (filterMood) {
      matchesMood = entry.mood === filterMood;
    }

    if (filterCategory) {
      matchesCategory = entry.category === filterCategory;
    }

    return matchesMood && matchesCategory;
  });

  const clearFilters = () => {
    setFilterMood(null);
    setFilterCategory(null);
  };

  return (
    <View style={styles.container}>
      {/* Filters */}
      {(filterMood || filterCategory) && (
        <View style={styles.filtersContainer}>
          <Text variant="bodyMedium" style={styles.filterText}>Filters:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {filterMood && (
              <Chip 
                icon={() => <MaterialCommunityIcons name={getMoodIcon(filterMood)} size={16} color={theme.colors.primary} />}
                onClose={() => setFilterMood(null)} 
                style={styles.filterChip}
              >
                {moods.find(m => m.value === filterMood)?.label || 'Mood'}
              </Chip>
            )}
            {filterCategory && (
              <Chip 
                icon={() => <MaterialCommunityIcons name={getCategoryIcon(filterCategory)} size={16} color={theme.colors.primary} />}
                onClose={() => setFilterCategory(null)} 
                style={styles.filterChip}
              >
                {getCategoryLabel(filterCategory)}
              </Chip>
            )}
            <Button 
              mode="text" 
              onPress={clearFilters}
              style={styles.clearButton}
              labelStyle={styles.clearButtonLabel}
            >
              Clear All
            </Button>
          </ScrollView>
        </View>
      )}

      <View style={styles.headerActions}>
        <Button 
          mode="text" 
          icon="cog-outline"
          onPress={() => navigation.navigate('JournalManagement')}
        >
          Manage Entries
        </Button>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="book-open-page-variant" size={64} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.emptyStateTitle}>No Journal Entries</Text>
            <Text variant="bodyMedium" style={styles.emptyStateText}>
              {filterMood || filterCategory 
                ? "No entries match your current filters. Try changing your filters or add a new entry."
                : "Start documenting your pregnancy journey by adding your first journal entry."}
            </Text>
          </View>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} style={styles.card} mode="elevated">
              <Card.Content>
                <View style={styles.entryHeader}>
                  <View style={styles.titleContainer}>
                    <MaterialCommunityIcons
                      name={getMoodIcon(entry.mood)}
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium" style={styles.entryTitle}>
                      {entry.title}
                    </Text>
                  </View>
                  <View style={styles.entryActions}>
                    <Text variant="bodySmall" style={styles.date}>
                      {formatDate(entry.date)}
                    </Text>
                    <TouchableOpacity
                      onPress={(event) => {
                        handleOpenEntryMenu(
                          entry.id,
                          event.nativeEvent.pageX,
                          event.nativeEvent.pageY
                        );
                      }}
                    >
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {entry.category && (
                  <Chip 
                    icon={() => <MaterialCommunityIcons name={getCategoryIcon(entry.category)} size={16} color={theme.colors.primary} />}
                    style={styles.categoryChip}
                    onPress={() => setFilterCategory(entry.category || null)}
                  >
                    {getCategoryLabel(entry.category)}
                  </Chip>
                )}
                <Text variant="bodyMedium" style={styles.content}>
                  {entry.content}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Entry Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={menuPosition}
      >
        <Menu.Item
          leadingIcon="pencil"
          onPress={() => {
            if (activeEntryId) {
              const entry = entries.find(e => e.id === activeEntryId);
              if (entry) {
                handleEditEntry(entry);
              }
            }
          }}
          title="Edit"
        />
        <Divider />
        <Menu.Item
          leadingIcon="delete"
          onPress={() => {
            if (activeEntryId) {
              handleDeleteEntry(activeEntryId);
            }
          }}
          title="Delete"
          titleStyle={{ color: theme.colors.error }}
        />
      </Menu>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => {
            resetForm();
            setVisible(false);
          }}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {editingEntryId ? 'Edit Journal Entry' : 'New Journal Entry'}
          </Text>
          
          <View style={styles.moodSelector}>
            <Text variant="bodyMedium" style={styles.moodLabel}>How are you feeling?</Text>
            <View style={styles.moodIcons}>
              {moods.map((mood) => (
                <IconButton
                  key={mood.value}
                  icon={mood.icon}
                  size={32}
                  mode={selectedMood === mood.value ? 'contained' : 'outlined'}
                  selected={selectedMood === mood.value}
                  onPress={() => setSelectedMood(mood.value)}
                />
              ))}
            </View>
          </View>

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.categorySelector}>
            <Text variant="bodyMedium" style={styles.categoryLabel}>Category (optional)</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              {categories.map((category) => (
                <Chip
                  key={category.value}
                  selected={selectedCategory === category.value}
                  onPress={() => setSelectedCategory(category.value)}
                  style={styles.categoryOption}
                  icon={category.icon}
                >
                  {category.label}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <View style={styles.modalActions}>
            <Button 
              onPress={() => {
                resetForm();
                setVisible(false);
              }} 
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSaveEntry} 
              style={styles.modalButton}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          resetForm();
          setVisible(true);
        }}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  moodSelector: {
    marginBottom: 20,
  },
  moodLabel: {
    marginBottom: 12,
    fontWeight: '500',
  },
  moodIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalButton: {
    marginLeft: 8,
  },
  categorySelector: {
    marginBottom: 20,
  },
  categoryLabel: {
    marginBottom: 12,
    fontWeight: '500',
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryOption: {
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterText: {
    marginBottom: 8,
    fontWeight: '500',
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  clearButton: {
    marginLeft: 4,
  },
  clearButtonLabel: {
    fontSize: 12,
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
  },
});

export default JournalScreen;