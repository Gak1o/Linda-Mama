import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Card, Text, ProgressBar, useTheme, Surface, Avatar, IconButton, Chip, Badge, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../auth/AuthContext';
import ProfileModal from './ProfileModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the custom theme type
import type { CustomTheme } from '../types/theme';

const { width } = Dimensions.get('window');

// Fruit and vegetable comparisons by week
const babySizeComparisons = [
  { week: 1, size: "a poppy seed", icon: "grain" },
  { week: 2, size: "a sesame seed", icon: "grain" },
  { week: 3, size: "a lentil", icon: "food-variant" },
  { week: 4, size: "a small bean", icon: "food-variant" },
  { week: 5, size: "an apple seed", icon: "seed" },
  { week: 6, size: "a pea", icon: "food" },
  { week: 7, size: "a blueberry", icon: "food" },
  { week: 8, size: "a raspberry", icon: "food" },
  { week: 9, size: "a cherry", icon: "fruit-cherries" },
  { week: 10, size: "a strawberry", icon: "food-apple" },
  { week: 11, size: "a lime", icon: "food-apple" },
  { week: 12, size: "a plum", icon: "food-apple" },
  { week: 13, size: "a peach", icon: "food-apple" },
  { week: 14, size: "a lemon", icon: "food-apple" },
  { week: 15, size: "an apple", icon: "food-apple" },
  { week: 16, size: "an avocado", icon: "food-apple" },
  { week: 17, size: "a pear", icon: "food-apple" },
  { week: 18, size: "a bell pepper", icon: "food" },
  { week: 19, size: "a tomato", icon: "food-apple" },
  { week: 20, size: "a banana", icon: "food-apple" },
  { week: 21, size: "a carrot", icon: "carrot" },
  { week: 22, size: "a corn cob", icon: "corn" },
  { week: 23, size: "a large mango", icon: "food-apple" },
  { week: 24, size: "an ear of corn", icon: "corn" },
  { week: 25, size: "a rutabaga", icon: "food" },
  { week: 26, size: "a head of lettuce", icon: "food" },
  { week: 27, size: "a cauliflower", icon: "food" },
  { week: 28, size: "an eggplant", icon: "food-apple" },
  { week: 29, size: "a butternut squash", icon: "food" },
  { week: 30, size: "a cabbage", icon: "food" },
  { week: 31, size: "a coconut", icon: "food-apple" },
  { week: 32, size: "a jicama", icon: "food" },
  { week: 33, size: "a pineapple", icon: "food-apple" },
  { week: 34, size: "a cantaloupe", icon: "food-apple" },
  { week: 35, size: "a honeydew melon", icon: "food-apple" },
  { week: 36, size: "a head of romaine lettuce", icon: "food" },
  { week: 37, size: "a bunch of swiss chard", icon: "food" },
  { week: 38, size: "a winter melon", icon: "food-apple" },
  { week: 39, size: "a watermelon", icon: "food-apple" },
  { week: 40, size: "a small pumpkin", icon: "food-apple" },
];

// Pregnancy facts by week
const pregnancyFacts = [
  { week: 1, fact: "Your baby's journey has just begun! The fertilized egg is making its way to the uterus for implantation." },
  { week: 2, fact: "Your baby is now called a blastocyst and has around 100 cells that will develop into different parts of their body." },
  { week: 3, fact: "The placenta and umbilical cord are starting to form. These will provide nutrients and oxygen to your baby." },
  { week: 4, fact: "Your baby's heart is beginning to form and will start beating around week 5 or 6." },
  { week: 5, fact: "Your baby's brain, spinal cord, and heart are developing rapidly this week." },
  { week: 6, fact: "Your baby's facial features are beginning to form, including the jaw, cheeks, and chin." },
  { week: 7, fact: "Your baby's limb buds are growing into arms and legs, and they're starting to make small movements." },
  { week: 8, fact: "All of your baby's essential organs have begun to develop, and their heart is now beating at a steady rhythm." },
  { week: 9, fact: "Your baby is no longer an embryo but is now considered a fetus. Their basic physiology is in place." },
  { week: 10, fact: "Your baby can now make tiny movements, though you won't feel them for several more weeks." },
  { week: 11, fact: "Your baby's hands and feet are developing distinct fingers and toes, losing their webbed appearance." },
  { week: 12, fact: "Your baby's fingerprints are forming this week! These unique patterns will stay with them for life." },
  { week: 13, fact: "Your baby is now able to make facial expressions, such as squinting and frowning." },
  { week: 14, fact: "Your baby's eyes and ears are moving into their final positions on the face." },
  { week: 15, fact: "Your baby is developing taste buds and may be able to taste what you eat through the amniotic fluid." },
  { week: 16, fact: "Your baby can now make sucking motions with their mouth, practicing for future feeding." },
  { week: 17, fact: "Your baby's skeleton is changing from cartilage to bone, and the umbilical cord is growing stronger." },
  { week: 18, fact: "Your baby's ears are now in their final position, and they may be able to hear your voice." },
  { week: 19, fact: "Your baby is developing a protective coating called vernix caseosa that protects their skin in the amniotic fluid." },
  { week: 20, fact: "Your baby is producing meconium in their intestinal tract—this will be their first bowel movement." },
  { week: 21, fact: "Your baby's eyebrows and eyelids are fully formed, and they're growing more hair on their head." },
  { week: 22, fact: "Your baby's sense of touch is developing, and they may reach out to touch their face or the umbilical cord." },
  { week: 23, fact: "Your baby's lungs are developing rapidly, preparing for their first breath after birth." },
  { week: 24, fact: "Your baby has a regular schedule of sleeping and waking periods, and you might notice patterns in their movement." },
  { week: 25, fact: "Your baby is gaining more fat under their skin, which will help regulate their body temperature after birth." },
  { week: 26, fact: "Your baby's eyes are beginning to open, and they'll soon be able to blink." },
  { week: 27, fact: "Your baby may be able to recognize your voice now and might respond to it with movement." },
  { week: 28, fact: "Your baby's brain is developing rapidly, with billions of neurons forming connections." },
  { week: 29, fact: "Your baby is practicing breathing movements, preparing their lungs for air." },
  { week: 30, fact: "Your baby's bone marrow has taken over the production of red blood cells." },
  { week: 31, fact: "Your baby can now turn their head from side to side and is likely in the head-down position." },
  { week: 32, fact: "Your baby's toenails and fingernails have grown and may need a trim soon after birth." },
  { week: 33, fact: "Your baby's immune system is developing, and you're passing antibodies to them through the placenta." },
  { week: 34, fact: "Your baby's central nervous system and lungs are maturing rapidly in preparation for birth." },
  { week: 35, fact: "Your baby's kidneys are fully developed, and their liver can process some waste products." },
  { week: 36, fact: "Your baby is likely in the head-down position now, preparing for birth." },
  { week: 37, fact: "Your baby is considered 'early term' now and has a good chance of being healthy if born this week." },
  { week: 38, fact: "Your baby's brain is still developing rapidly and will continue to develop after birth." },
  { week: 39, fact: "Your baby's reflexes are coordinated now, including sucking, swallowing, and blinking." },
  { week: 40, fact: "Your baby is fully developed and ready to meet you! They'll continue to gain weight until birth." },
];

const HomePage = ({ navigation }: any) => {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const { user } = useAuth();
  
  // Cast the theme to our custom theme type
  const theme = useTheme() as CustomTheme;
  
  // Due date state (stored as ISO string)
  const [dueDate, setDueDate] = useState<string | null>(null);
  
  // Current week calculation based on due date
  const calculateCurrentWeek = (): number => {
    if (!dueDate) return 12; // Default if no due date is set
    
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    
    // Pregnancy is typically 40 weeks from the start
    // Due date is at the end of 40 weeks
    // So we need to calculate how many weeks are left and subtract from 40
    
    const timeDiff = dueDateObj.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const weeksLeft = Math.ceil(daysLeft / 7);
    
    const currentWeek = 40 - weeksLeft;
    
    // Ensure the week is within valid range
    if (currentWeek < 1) return 1;
    if (currentWeek > 40) return 40;
    
    return currentWeek;
  };
  
  // Get current week and total weeks
  const currentWeek = calculateCurrentWeek();
  const totalWeeks = 40;
  const progress = currentWeek / totalWeeks;
  
  // Get baby size comparison for current week
  const getBabySizeComparison = () => {
    const comparison = babySizeComparisons.find(item => item.week === currentWeek) || 
                      babySizeComparisons[0]; // Default to first week if not found
    return comparison;
  };
  
  const babySize = getBabySizeComparison();
  
  // Get pregnancy fact for current week
  const getPregnancyFact = () => {
    const fact = pregnancyFacts.find(item => item.week === currentWeek) || 
                pregnancyFacts[0]; // Default to first week if not found
    return fact;
  };
  
  const pregnancyFact = getPregnancyFact();

  // Today's tracking states
  const [checkupCompleted, setCheckupCompleted] = useState(false);
  const [vitaminsCount, setVitaminsCount] = useState(2);
  const [waterCount, setWaterCount] = useState(4);
  const totalWaterGoal = 8;

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Get today's date in YYYY-MM-DD format for storage key
        const today = new Date().toISOString().split('T')[0];
        
        // Try to load today's data from storage
        const savedDataJson = await AsyncStorage.getItem(`healthTracking_${today}`);
        
        if (savedDataJson) {
          const savedData = JSON.parse(savedDataJson);
          setCheckupCompleted(savedData.checkupCompleted || false);
          setVitaminsCount(savedData.vitaminsCount || 2);
          setWaterCount(savedData.waterCount || 0);
        }
        
        // Load due date
        const savedDueDate = await AsyncStorage.getItem('pregnancyDueDate');
        if (savedDueDate) {
          setDueDate(savedDueDate);
        } else {
          // If no due date is set, set a default due date (7 months from now for demo)
          const defaultDueDate = new Date();
          defaultDueDate.setMonth(defaultDueDate.getMonth() + 7);
          const defaultDueDateString = defaultDueDate.toISOString();
          await AsyncStorage.setItem('pregnancyDueDate', defaultDueDateString);
          setDueDate(defaultDueDateString);
        }
      } catch (error) {
        console.error('Failed to load health tracking data:', error);
      }
    };
    
    loadSavedData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        // Get today's date in YYYY-MM-DD format for storage key
        const today = new Date().toISOString().split('T')[0];
        
        // Save the current state to storage
        const dataToSave = {
          checkupCompleted,
          vitaminsCount,
          waterCount,
          lastUpdated: new Date().toISOString()
        };
        
        await AsyncStorage.setItem(`healthTracking_${today}`, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Failed to save health tracking data:', error);
      }
    };
    
    saveData();
  }, [checkupCompleted, vitaminsCount, waterCount]);

  // Handler for checkup completion
  const toggleCheckupCompleted = () => {
    setCheckupCompleted(prev => !prev);
  };

  // Handler for vitamins tracking
  const handleVitamins = (action: 'take' | 'add') => {
    if (action === 'take' && vitaminsCount > 0) {
      setVitaminsCount(prev => prev - 1);
    } else if (action === 'add') {
      setVitaminsCount(prev => prev + 1);
    } else if (action === 'take' && vitaminsCount === 0) {
      Alert.alert('No Vitamins Left', 'You have no vitamins remaining to take. Add more vitamins first.');
    }
  };

  // Handler for water tracking
  const handleWater = (action: 'drink' | 'reset') => {
    if (action === 'drink' && waterCount < totalWaterGoal) {
      setWaterCount(prev => prev + 1);
    } else if (action === 'reset') {
      setWaterCount(0);
    } else if (action === 'drink' && waterCount >= totalWaterGoal) {
      Alert.alert('Water Goal Reached', 'Congratulations! You\'ve reached your water intake goal for today.');
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Navigation handlers for quick actions
  const navigateToJournal = () => {
    navigation.navigate('Journal');
  };

  const navigateToAIAssistant = () => {
    navigation.navigate('AI Assistant');
  };

  const navigateToAppointments = () => {
    navigation.navigate('Appointments');
  };

  const navigateToResources = () => {
    navigation.navigate('Resources');
  };

  // Navigation handler for viewing all appointments
  const viewAllAppointments = () => {
    navigation.navigate('Appointments');
  };

  // Navigation handler for viewing all resources
  const viewAllResources = () => {
    navigation.navigate('Resources');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      {/* Main Gradient Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.headerGradient}
      >
        {/* Top Bar with Profile */}
        <View style={styles.topBar}>
          <View style={styles.welcomeSection}>
            <Text variant="titleMedium" style={styles.welcomeText}>Welcome back,</Text>
            <Text variant="headlineSmall" style={styles.userName}>
              {user ? user.name.split(' ')[0] : 'User'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
            {user ? (
              <Avatar.Text
                size={40}
                label={getInitials(user.name)}
                style={styles.avatar}
                color="#fff"
                theme={{ colors: { primary: theme.colors.tertiary } }}
              />
            ) : (
              <IconButton
                icon="account-circle"
                size={30}
                iconColor="#fff"
                onPress={() => setProfileModalVisible(true)}
              />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Pregnancy Progress Summary */}
        <View style={styles.progressSummary}>
          <View style={styles.weekInfo}>
            <Text variant="displaySmall" style={styles.weekNumber}>{currentWeek}</Text>
            <View>
              <Text variant="titleMedium" style={styles.weekLabel}>Week</Text>
              <Text variant="bodyMedium" style={styles.totalWeeks}>of {totalWeeks}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress}
              color="#fff"
              style={styles.progressBar}
            />
            <View style={styles.trimesterLabels}>
              <Text style={styles.trimesterText}>1st</Text>
              <Text style={styles.trimesterText}>2nd</Text>
              <Text style={styles.trimesterText}>3rd</Text>
            </View>
          </View>
        </View>
        
        {/* Baby Size */}
        <View style={styles.babySizeCard}>
          <View style={styles.babySizeContent}>
            <MaterialCommunityIcons name={babySize.icon} size={36} color={theme.colors.primary} />
            <View style={styles.babySizeInfo}>
              <Text variant="titleMedium" style={styles.babySizeTitle}>Baby Size</Text>
              <Text variant="bodyLarge" style={styles.babySizeText}>
                Your baby is the size of {babySize.size}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Profile Modal */}
      <ProfileModal 
        visible={profileModalVisible} 
        onDismiss={() => setProfileModalVisible(false)} 
        navigation={navigation} 
      />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Today's Summary */}
        <View style={styles.todaySummary}>
          <Text variant="titleLarge" style={styles.sectionHeading}>Today</Text>
          <View style={styles.todayCards}>
            <Card style={[styles.todayCard, checkupCompleted && styles.completedCard]} mode="elevated">
              <Card.Content style={styles.todayCardContent}>
                <MaterialCommunityIcons 
                  name={checkupCompleted ? "check-circle" : "calendar-check"} 
                  size={24} 
                  color={checkupCompleted ? theme.colors.success : theme.colors.primary} 
                />
                <Text variant="titleMedium" style={styles.todayCardTitle}>Checkup</Text>
                <Text variant="bodyMedium" style={styles.todayCardText}>
                  {checkupCompleted ? "Completed" : "10:00 AM"}
                </Text>
                <TouchableOpacity 
                  style={[styles.actionButton, checkupCompleted && styles.completedButton]} 
                  onPress={toggleCheckupCompleted}
                >
                  <Text style={styles.actionButtonText}>
                    {checkupCompleted ? "Undo" : "Mark Done"}
                  </Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
            
            <Card style={styles.todayCard} mode="elevated">
              <Card.Content style={styles.todayCardContent}>
                <MaterialCommunityIcons name="pill" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.todayCardTitle}>Vitamins</Text>
                <Text variant="bodyMedium" style={styles.todayCardText}>{vitaminsCount} remaining</Text>
                <View style={styles.actionButtonRow}>
                  <TouchableOpacity 
                    style={[styles.smallActionButton, { backgroundColor: theme.colors.primary }]} 
                    onPress={() => handleVitamins('take')}
                  >
                    <Text style={styles.actionButtonText}>Take</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.smallActionButton, { backgroundColor: theme.colors.tertiary }]} 
                    onPress={() => handleVitamins('add')}
                  >
                    <Text style={styles.actionButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
            
            <Card style={styles.todayCard} mode="elevated">
              <Card.Content style={styles.todayCardContent}>
                <MaterialCommunityIcons name="water" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.todayCardTitle}>Water</Text>
                <Text variant="bodyMedium" style={styles.todayCardText}>{waterCount}/{totalWaterGoal} glasses</Text>
                <View style={styles.actionButtonRow}>
                  <TouchableOpacity 
                    style={[styles.smallActionButton, { backgroundColor: theme.colors.primary }]} 
                    onPress={() => handleWater('drink')}
                  >
                    <Text style={styles.actionButtonText}>Drink</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.smallActionButton, { backgroundColor: theme.colors.error }]} 
                    onPress={() => handleWater('reset')}
                  >
                    <Text style={styles.actionButtonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.waterProgressContainer}>
                  <ProgressBar
                    progress={waterCount / totalWaterGoal}
                    color={theme.colors.primary}
                    style={styles.waterProgressBar}
                  />
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text variant="titleLarge" style={styles.sectionHeading}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction} onPress={navigateToJournal}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E1F5FE' }]}>
                <MaterialCommunityIcons name="book-open-variant" size={28} color="#0288D1" />
              </View>
              <Text style={styles.quickActionText}>Journal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction} onPress={navigateToAIAssistant}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="robot" size={28} color="#388E3C" />
              </View>
              <Text style={styles.quickActionText}>AI Assistant</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction} onPress={navigateToAppointments}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="calendar" size={28} color="#F57C00" />
              </View>
              <Text style={styles.quickActionText}>Appointments</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction} onPress={navigateToResources}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F3E5F5' }]}>
                <MaterialCommunityIcons name="bookshelf" size={28} color="#8E24AA" />
              </View>
              <Text style={styles.quickActionText}>Resources</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fun Fact Card */}
        <Card style={styles.factCard} mode="elevated">
          <LinearGradient
            colors={['#FFF9C4', '#FFECB3']}
            style={styles.factGradient}
          >
            <Card.Content>
              <View style={styles.factHeader}>
                <MaterialCommunityIcons name="lightbulb" size={28} color="#FFA000" />
                <Text variant="titleLarge" style={styles.factTitle}>Did you know?</Text>
              </View>
              <Text variant="bodyLarge" style={styles.factText}>
                {pregnancyFact.fact}
              </Text>
            </Card.Content>
          </LinearGradient>
        </Card>

        {/* Upcoming Appointments */}
        <Card style={styles.appointmentsCard} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <MaterialCommunityIcons name="calendar-clock" size={24} color={theme.colors.primary} />
                <Text variant="titleLarge" style={styles.cardTitle}>
                  Upcoming Appointments
                </Text>
              </View>
              <IconButton icon="dots-horizontal" size={20} onPress={viewAllAppointments} />
            </View>
            
            <View style={styles.appointment}>
              <View style={styles.appointmentDate}>
                <Text style={styles.appointmentDay}>15</Text>
                <Text style={styles.appointmentMonth}>MAR</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text variant="titleMedium" style={styles.appointmentTitle}>Prenatal Checkup</Text>
                <Text variant="bodyMedium" style={styles.appointmentTime}>
                  10:00 AM with Dr. Sarah Johnson
                </Text>
                <View style={styles.appointmentTags}>
                  <Chip 
                    style={styles.appointmentTag} 
                    textStyle={styles.appointmentTagText}
                    icon="map-marker"
                  >
                    City Hospital
                  </Chip>
                </View>
              </View>
            </View>
            
            <View style={[styles.appointment, styles.appointmentLast]}>
              <View style={styles.appointmentDate}>
                <Text style={styles.appointmentDay}>28</Text>
                <Text style={styles.appointmentMonth}>MAR</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text variant="titleMedium" style={styles.appointmentTitle}>Ultrasound</Text>
                <Text variant="bodyMedium" style={styles.appointmentTime}>
                  2:30 PM with Dr. Michael Chen
                </Text>
                <View style={styles.appointmentTags}>
                  <Chip 
                    style={styles.appointmentTag} 
                    textStyle={styles.appointmentTagText}
                    icon="map-marker"
                  >
                    Women's Clinic
                  </Chip>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Articles & Resources */}
        <View style={styles.resourcesSection}>
          <View style={styles.sectionTitleRow}>
            <Text variant="titleLarge" style={styles.sectionHeading}>Articles & Resources</Text>
            <TouchableOpacity onPress={viewAllResources}>
              <Text variant="bodyMedium" style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.resourcesScroll}>
            <Card style={styles.resourceCard} mode="elevated">
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500' }}
                style={styles.resourceImage}
                imageStyle={styles.resourceImageStyle}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.resourceGradient}
                >
                  <Badge style={styles.resourceBadge}>New</Badge>
                  <Text variant="titleMedium" style={styles.resourceTitle}>
                    Nutrition Guide: Second Trimester
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </Card>
            
            <Card style={styles.resourceCard} mode="elevated">
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=500' }}
                style={styles.resourceImage}
                imageStyle={styles.resourceImageStyle}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.resourceGradient}
                >
                  <Text variant="titleMedium" style={styles.resourceTitle}>
                    Preparing Your Home for Baby
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </Card>
            
            <Card style={styles.resourceCard} mode="elevated">
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500' }}
                style={styles.resourceImage}
                imageStyle={styles.resourceImageStyle}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.resourceGradient}
                >
                  <Text variant="titleMedium" style={styles.resourceTitle}>
                    Exercise Routines for Expectant Mothers
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </Card>
          </ScrollView>
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeSection: {
    flexDirection: 'column',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  userName: {
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressSummary: {
    marginBottom: 20,
  },
  weekInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
  },
  weekLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalWeeks: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  trimesterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  trimesterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  babySizeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: -30,
  },
  babySizeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  babySizeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  babySizeTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
  },
  babySizeText: {
    color: '#333',
  },
  scrollContent: {
    flex: 1,
    paddingTop: 40,
  },
  todaySummary: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeading: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  todayCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  todayCard: {
    width: '31%',
    marginBottom: 12,
    elevation: 2,
  },
  todayCardContent: {
    alignItems: 'center',
    padding: 12,
    height: 180,
    justifyContent: 'space-between',
  },
  todayCardTitle: {
    marginTop: 8,
    fontWeight: '700',
    textAlign: 'center',
  },
  todayCardText: {
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  completedCard: {
    backgroundColor: '#E8F5E9',
  },
  actionButton: {
    backgroundColor: '#7C4DFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  actionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  smallActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  waterProgressContainer: {
    width: '100%',
    marginTop: 8,
  },
  waterProgressBar: {
    height: 6,
    borderRadius: 3,
  },
  quickActionsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    fontWeight: 'bold',
    color: '#333',
  },
  factCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  factGradient: {
    borderRadius: 16,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factTitle: {
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  factText: {
    color: '#333',
    lineHeight: 22,
  },
  appointmentsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  appointment: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appointmentLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  appointmentDate: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appointmentDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentMonth: {
    fontSize: 14,
    color: '#666',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appointmentTime: {
    color: '#666',
    marginBottom: 8,
  },
  appointmentTags: {
    flexDirection: 'row',
  },
  appointmentTag: {
    backgroundColor: '#f0f0f0',
    height: 26,
  },
  appointmentTagText: {
    fontSize: 12,
  },
  resourcesSection: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  seeAllLink: {
    color: '#7C4DFF',
  },
  resourcesScroll: {
    paddingLeft: 16,
  },
  resourceCard: {
    width: 280,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  resourceImage: {
    width: '100%',
    height: '100%',
  },
  resourceImageStyle: {
    borderRadius: 16,
  },
  resourceGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    position: 'relative',
  },
  resourceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#7C4DFF',
  },
  resourceTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 24,
  },
});

export default HomePage;