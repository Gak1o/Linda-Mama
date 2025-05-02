import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, FAB, Button, useTheme, Portal, Modal, TextInput, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MaterialCommunityIcons as MCIType } from '@expo/vector-icons';

interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  doctor: string;
  location: string;
  type: string;
}

// Memoized input component to prevent unnecessary re-renders
const MemoizedTextInput = memo(({ label, value, onChangeText, placeholder, style }: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style: any;
}) => (
  <TextInput
    label={label}
    mode="outlined"
    style={style}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
  />
));

// Memoized chip component
const MemoizedChip = memo(({ selected, onPress, style, children }: {
  selected: boolean;
  onPress: () => void;
  style: any;
  children: React.ReactNode;
}) => (
  <Chip
    selected={selected}
    onPress={onPress}
    style={style}
  >
    {children}
  </Chip>
));

const AppointmentCard = memo(({ appointment, getAppointmentIcon, formatDate, theme }: {
  appointment: Appointment;
  getAppointmentIcon: (type: string) => string;
  formatDate: (date: Date) => string;
  theme: any;
}) => (
  <Card key={appointment.id} style={styles.appointmentCard}>
    <Card.Content>
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentTitle}>
          <MaterialCommunityIcons
            name={getAppointmentIcon(appointment.type)}
            size={24}
            color={theme.colors.primary}
          />
          <Text variant="titleMedium" style={styles.title}>
            {appointment.title}
          </Text>
        </View>
        <Button
          mode="outlined"
          compact
          onPress={() => {}}
        >
          Reschedule
        </Button>
      </View>
      
      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar" size={20} color="#666" />
          <Text variant="bodyMedium" style={styles.detailText}>
            {formatDate(appointment.date)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
          <Text variant="bodyMedium" style={styles.detailText}>
            {appointment.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="doctor" size={20} color="#666" />
          <Text variant="bodyMedium" style={styles.detailText}>
            {appointment.doctor}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
          <Text variant="bodyMedium" style={styles.detailText}>
            {appointment.location}
          </Text>
        </View>
      </View>
    </Card.Content>
  </Card>
));

// Form modal component
const AppointmentFormModal = memo(({ 
  visible, 
  onDismiss, 
  title,
  dateInput,
  timeInput,
  doctor,
  location,
  appointmentType,
  handleTitleChange,
  handleDateChange,
  handleTimeChange,
  handleDoctorChange,
  handleLocationChange,
  handleTypeChange,
  addAppointment
}: {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  dateInput: string;
  timeInput: string;
  doctor: string;
  location: string;
  appointmentType: string;
  handleTitleChange: (text: string) => void;
  handleDateChange: (text: string) => void;
  handleTimeChange: (text: string) => void;
  handleDoctorChange: (text: string) => void;
  handleLocationChange: (text: string) => void;
  handleTypeChange: (type: string) => void;
  addAppointment: () => void;
}) => (
  <Modal
    visible={visible}
    onDismiss={onDismiss}
    contentContainerStyle={styles.modalContent}
  >
    <Text variant="titleLarge" style={styles.modalTitle}>
      New Appointment
    </Text>
    <MemoizedTextInput
      label="Title"
      style={styles.input}
      value={title}
      onChangeText={handleTitleChange}
    />
    <MemoizedTextInput
      label="Date (MM/DD/YYYY)"
      style={styles.input}
      value={dateInput}
      onChangeText={handleDateChange}
      placeholder="MM/DD/YYYY"
    />
    <MemoizedTextInput
      label="Time"
      style={styles.input}
      value={timeInput}
      onChangeText={handleTimeChange}
      placeholder="e.g., 10:00 AM"
    />
    <MemoizedTextInput
      label="Doctor"
      style={styles.input}
      value={doctor}
      onChangeText={handleDoctorChange}
    />
    <MemoizedTextInput
      label="Location"
      style={styles.input}
      value={location}
      onChangeText={handleLocationChange}
    />
    <View style={styles.typeSelection}>
      <Text variant="bodyMedium" style={styles.typeLabel}>Appointment Type:</Text>
      <View style={styles.typeChips}>
        <MemoizedChip
          selected={appointmentType === 'checkup'}
          onPress={() => handleTypeChange('checkup')}
          style={styles.typeChip}
        >
          Checkup
        </MemoizedChip>
        <MemoizedChip
          selected={appointmentType === 'ultrasound'}
          onPress={() => handleTypeChange('ultrasound')}
          style={styles.typeChip}
        >
          Ultrasound
        </MemoizedChip>
        <MemoizedChip
          selected={appointmentType === 'lab'}
          onPress={() => handleTypeChange('lab')}
          style={styles.typeChip}
        >
          Lab Test
        </MemoizedChip>
      </View>
    </View>
    <View style={styles.modalActions}>
      <Button onPress={onDismiss} style={styles.modalButton}>
        Cancel
      </Button>
      <Button
        mode="contained"
        onPress={addAppointment}
        style={styles.modalButton}
      >
        Save
      </Button>
    </View>
  </Modal>
));

const AppointmentsScreen = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Regular Checkup',
      date: new Date(2024, 2, 15),
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      location: "Women's Health Clinic",
      type: 'checkup'
    },
    {
      id: '2',
      title: 'Ultrasound',
      date: new Date(2024, 2, 22),
      time: '2:30 PM',
      doctor: 'Dr. Michael Chen',
      location: 'Imaging Center',
      type: 'ultrasound'
    }
  ]);

  const [title, setTitle] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [doctor, setDoctor] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentType, setAppointmentType] = useState('checkup');

  // Memoized callbacks to prevent recreation on each render
  const handleTitleChange = useCallback((text: string) => setTitle(text), []);
  const handleDateChange = useCallback((text: string) => setDateInput(text), []);
  const handleTimeChange = useCallback((text: string) => setTimeInput(text), []);
  const handleDoctorChange = useCallback((text: string) => setDoctor(text), []);
  const handleLocationChange = useCallback((text: string) => setLocation(text), []);
  const handleTypeChange = useCallback((type: string) => setAppointmentType(type), []);

  const resetForm = useCallback(() => {
    setTitle('');
    setDateInput('');
    setTimeInput('');
    setDoctor('');
    setLocation('');
    setAppointmentType('checkup');
  }, []);

  const handleCloseModal = useCallback(() => {
    setVisible(false);
    resetForm();
  }, [resetForm]);

  const handleOpenModal = useCallback(() => {
    setVisible(true);
  }, []);

  const getAppointmentIcon = useCallback((type: string): string => {
    switch (type) {
      case 'ultrasound':
        return 'ultrasound';
      case 'checkup':
        return 'stethoscope';
      case 'lab':
        return 'test-tube';
      default:
        return 'calendar';
    }
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const addAppointment = useCallback(() => {
    // Basic validation
    if (!title || !dateInput || !timeInput || !doctor || !location) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    let parsedDate: Date;
    try {
      const [month, day, year] = dateInput.split('/').map(Number);
      parsedDate = new Date(year, month - 1, day);
      
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      Alert.alert('Invalid Date', 'Please enter date in MM/DD/YYYY format');
      return;
    }

    // Create new appointment object
    const newAppointmentObj: Appointment = {
      id: Date.now().toString(), // Simple ID generation
      title,
      date: parsedDate,
      time: timeInput,
      doctor,
      location,
      type: appointmentType
    };

    // Add to appointments array using functional update to ensure latest state
    setAppointments(prevAppointments => [...prevAppointments, newAppointmentObj]);
    
    // Reset form and close modal
    handleCloseModal();
  }, [title, dateInput, timeInput, doctor, location, appointmentType, handleCloseModal]);

  // Memoize the appointment list to prevent unnecessary re-renders
  const appointmentsList = useMemo(() => {
    if (appointments.length === 0) {
      return (
        <Card style={styles.appointmentCard}>
          <Card.Content>
            <Text style={styles.noAppointmentsText}>No appointments scheduled</Text>
          </Card.Content>
        </Card>
      );
    }
    
    return appointments.map(appointment => (
      <AppointmentCard
        key={appointment.id}
        appointment={appointment}
        getAppointmentIcon={getAppointmentIcon}
        formatDate={formatDate}
        theme={theme}
      />
    ));
  }, [appointments, getAppointmentIcon, formatDate, theme]);

  // Memoize the next appointment section
  const nextAppointmentSection = useMemo(() => {
    if (appointments.length === 0) {
      return <Text variant="bodyMedium">No upcoming appointments</Text>;
    }
    
    return (
      <View style={styles.nextAppointment}>
        <MaterialCommunityIcons
          name="calendar-clock"
          size={40}
          color={theme.colors.primary}
        />
        <View style={styles.appointmentInfo}>
          <Text variant="titleMedium">{appointments[0].title}</Text>
          <Text variant="bodyMedium">{formatDate(appointments[0].date)} at {appointments[0].time}</Text>
          <Text variant="bodyMedium">{appointments[0].doctor}</Text>
        </View>
      </View>
    );
  }, [appointments, formatDate, theme.colors.primary]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.upcomingCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Next Appointment
            </Text>
            {nextAppointmentSection}
          </Card.Content>
        </Card>

        <View style={styles.filterChips}>
          <MemoizedChip
            selected={true}
            onPress={() => {}}
            style={styles.chip}
          >
            All
          </MemoizedChip>
          <MemoizedChip
            selected={false}
            onPress={() => {}}
            style={styles.chip}
          >
            Checkups
          </MemoizedChip>
          <MemoizedChip
            selected={false}
            onPress={() => {}}
            style={styles.chip}
          >
            Ultrasounds
          </MemoizedChip>
        </View>

        <Text variant="titleMedium" style={styles.listTitle}>
          Upcoming Appointments
        </Text>

        {appointmentsList}
      </ScrollView>

      <Portal>
        <AppointmentFormModal
          visible={visible}
          onDismiss={handleCloseModal}
          title={title}
          dateInput={dateInput}
          timeInput={timeInput}
          doctor={doctor}
          location={location}
          appointmentType={appointmentType}
          handleTitleChange={handleTitleChange}
          handleDateChange={handleDateChange}
          handleTimeChange={handleTimeChange}
          handleDoctorChange={handleDoctorChange}
          handleLocationChange={handleLocationChange}
          handleTypeChange={handleTypeChange}
          addAppointment={addAppointment}
        />
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleOpenModal}
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  upcomingCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  nextAppointment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentInfo: {
    marginLeft: 16,
  },
  filterChips: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  listTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  appointmentCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    fontWeight: '600',
  },
  appointmentDetails: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
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
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
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
  typeSelection: {
    marginBottom: 16,
  },
  typeLabel: {
    marginBottom: 8,
  },
  typeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  noAppointmentsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});

export default AppointmentsScreen;