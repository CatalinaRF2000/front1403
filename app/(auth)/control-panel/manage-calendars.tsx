import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';  
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import CONFIG from '../../../assets/config';

export default function ManageCalendars() {
  const [calendars, setCalendars] = useState([]);
  const [filteredCalendars, setFilteredCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = `${CONFIG.API_BASE_URL}/admin/calendarios`;

  useEffect(() => {
    fetchCalendars();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCalendars(calendars);
    } else {
      setFilteredCalendars(
        calendars.filter(calendar =>
          calendar.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, calendars]);

  const fetchCalendars = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCalendars(response.data);
      setFilteredCalendars(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los calendarios.');
      setLoading(false);
    }
  };

  const handleEditCalendar = (calendar) => {
    setSelectedCalendar(calendar);
    setShowPreview(false);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      const response = await axios.put(`${API_URL}/${selectedCalendar.id}`, {
        titulo: selectedCalendar.titulo,
        html: selectedCalendar.html,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Éxito', 'Calendario actualizado correctamente.');
      setIsModalVisible(false);
      fetchCalendars();
    } catch (error) {
      console.error('Error al actualizar el calendario:', error);
      Alert.alert('Error', 'No se pudo actualizar el calendario.');
    }
  };

  const renderCalendar = ({ item }) => (
    <View style={styles.calendarCard}>
      <Text style={styles.calendarTitle}>{item.titulo || 'Sin título'}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditCalendar(item)}
        >
          <Text style={styles.editText}>Ver calendario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Calendarios</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar calendario..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCalendars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCalendar}
        contentContainerStyle={styles.calendarList}
      />
      {isModalVisible && selectedCalendar && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Calendario</Text>
              <TextInput
                style={styles.input}
                placeholder="Título"
                value={selectedCalendar.titulo}
                onChangeText={(text) => setSelectedCalendar({ ...selectedCalendar, titulo: text })}
              />
              <TextInput
                style={[styles.input, styles.htmlInput]}
                placeholder="HTML del calendario"
                value={selectedCalendar.html}
                onChangeText={(text) => setSelectedCalendar({ ...selectedCalendar, html: text })}
                multiline
              />
              {showPreview && (
                <View style={styles.previewContainer}>
                  <iframe
                    title="calendar-preview"
                    srcDoc={selectedCalendar.html}
                    style={styles.previewIframe}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.previewButton}
                onPress={() => setShowPreview(!showPreview)}
              >
                <Text style={styles.previewText}>{showPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa'}</Text>
              </TouchableOpacity>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  calendarList: {
    paddingBottom: 20,
  },
  calendarCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  actions: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro traslucido
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  htmlInput: {
    height: 120, // Aumenta la altura del campo HTML
    textAlignVertical: 'top',
  },
  previewContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  previewButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  previewText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro traslúcido
    },
    modalContent: {
      width: '90%',
      height: '80%', // Ocupa el 80% de la pantalla
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    input: {
      backgroundColor: '#f7f7f7',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      marginBottom: 10,
    },
    htmlInput: {
      height: '35%', // Hace que el área del HTML sea más grande
      textAlignVertical: 'top',
    },
    previewContainer: {
      flex: 1, // Hace que la vista previa ocupe todo el espacio disponible
      marginTop: 10,
      padding: 10,
      backgroundColor: '#fafafa',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
  
});
