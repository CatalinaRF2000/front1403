import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import CONFIG from '../../assets/config';
import Toast from 'react-native-toast-message';

export default function CalendarScreen() {
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      const endpoint = `${CONFIG.API_BASE_URL}/user/${userId}/calendarios`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📢 Calendarios recibidos:', response.data);

      if (response.data.length > 0) {
        console.log('✅ Primer calendario:', response.data[0].html);
        setCalendar(response.data[0]);
      } else {
        setCalendar(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error al cargar el calendario:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo encontrar el calendario.',
      });
            setLoading(false);
    }
  };

  const sanitizeHtml = (html) => {
    if (!html) return '<p>Sin contenido</p>';
    return html.replace(
      /<iframe([^>]*)>/g,
      `<iframe$1 style="width: 100%; height: 100%; aspect-ratio: 16/9; min-height: 300px; max-height: ${screenHeight * 0.8}px; overflow: hidden;"></iframe>`
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text>Cargando calendario...</Text>
      </View>
    );
  }

  if (!calendar) {
    return (
      <View style={styles.container}>
        <Text style={styles.noCalendarText}>No hay calendarios disponibles.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{calendar.titulo || 'Calendario'}</Text>

      <View style={styles.calendarContainer}>
        {Platform.OS === 'web' ? (
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(calendar.html) }}
            style={{
              width: '100%',
              maxWidth: screenWidth * 0.9,
              height: screenHeight * 0.7,
              minHeight: 300,
              aspectRatio: 16 / 9,
              border: '1px solid #ccc',
              overflow: 'hidden',
            }}
          />
        ) : (
          <RenderHtml
            contentWidth={screenWidth * 0.9}
            source={{ html: sanitizeHtml(calendar.html) }}
            tagsStyles={{ iframe: styles.iframe }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCalendarText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  calendarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iframe: {
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    minHeight: 300,
    aspectRatio: 16 / 9,
    overflow: 'hidden',
  },
});
