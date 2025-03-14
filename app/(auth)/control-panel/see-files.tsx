import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Alert, StyleSheet 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CONFIG from '../../../assets/config';
import Modal from 'react-native-modal';
import * as FileSystem from 'expo-file-system';

export default function SeeFiles() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = `${CONFIG.API_BASE_URL}/admin/files`;

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      // Si no hay búsqueda, mostramos la lista normal sin modificar el orden.
      setFilteredFiles(files);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = files.filter(file =>
        file.usuario?.toLowerCase().includes(query) || 
        file.file_name?.toLowerCase().includes(query)
      );
  
      // Ordenar los resultados alfabéticamente por nombre de archivo
      const sortedFiltered = filtered.sort((a, b) => 
        a.file_name.localeCompare(b.file_name)
      );
  
      setFilteredFiles(sortedFiltered);
    }
  }, [searchQuery, files]);
  

  const toggleModal = (fileId = null) => {
    setSelectedFileId(fileId);
    setModalVisible(!modalVisible);
  };

  const handleDelete = async () => {
    if (!selectedFileId) return;
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.delete(`${API_URL}/${selectedFileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalVisible(false);
      fetchFiles();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el archivo.');
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const downloadUrl = `${API_URL}/download/${fileId}`;
      const fileUri = FileSystem.documentDirectory + fileName;
      const response = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Descarga completa', `Archivo guardado en: ${response.uri}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo descargar el archivo.');
    }
  };

  const fetchFiles = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles([...response.data.facturas, ...response.data.nominas] || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Archivos</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por usuario o nombre de archivo..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#EA8519" />
      ) : (
        <FlatList
          data={filteredFiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.fileCard}>
              <View style={styles.fileHeader}>
                <Text style={styles.fileName}>{item.file_name}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item.id, item.file_name)}>
                    <Text style={styles.buttonText}>Descargar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => toggleModal(item.id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.fileDetails}>📄 {item.tipo} | 👤 {item.usuario}</Text>
            </View>
          )}
        />
      )}

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
          <Text>¿Estás seguro de que deseas eliminar este archivo?</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7edea',
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
  fileCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  fileDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  downloadButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});
