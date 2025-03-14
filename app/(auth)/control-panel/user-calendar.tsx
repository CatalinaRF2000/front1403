import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function UserCalendar() {
  const router = useRouter();
  const { userId, calendar } = useLocalSearchParams();
  const [calendarData, setCalendarData] = useState(calendar || '');
  const API_URL = `${CONFIG.API_BASE_URL}/api/user/${userId}/calendarios/${userId}`;

  useEffect(() => {
    if (!calendar) {
      fetchCalendar();
    }
  }, []);

  const fetchCalendar = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendarData(response.data?.html || '');
    } catch (error) {
      console.error('Error al cargar el calendario:', error);
      Alert.alert('Error', 'No se pudo cargar el calendario.');
    }
  };

  const handleSaveCalendar = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.put(
        API_URL,
        { html: calendarData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Éxito', 'Calendario actualizado correctamente.');
      router.back();
    } catch (error) {
      console.error('Error al guardar el calendario:', error);
      Alert.alert('Error', 'No se pudo guardar el calendario.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Calendario</Text>
      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.calendarInput}
          placeholder="Añadir calendario"
          value={calendarData}
          onChangeText={setCalendarData}
          multiline
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveCalendar}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  calendarInput: {
    height: 200,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
