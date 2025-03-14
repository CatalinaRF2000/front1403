import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import CONFIG from '../../../assets/config';
import Toast from 'react-native-toast-message';  // ✅ Importar Toast

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function ManageFiles() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('factura'); // 'factura' o 'nomina'

  const API_URL = `${CONFIG.API_BASE_URL}/admin/users`;

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredUsers =
        activeTab === 'factura'
          ? response.data.filter((user) => user.role === 'cliente')
          : response.data.filter((user) =>
              ['artista', 'animador', 'socorrista'].includes(user.role)
            );

      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar los usuarios.',
      });
      setLoading(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (!result.canceled) {
        const selectedFile = result.assets?.[0] || result;
        setFile({
          uri: selectedFile.uri,
          name: selectedFile.name || 'archivo_seleccionado',
          type: selectedFile.type || 'application/octet-stream',
        });

        Toast.show({
          type: 'success',
          text1: 'Archivo seleccionado',
          text2: `Has seleccionado: ${selectedFile.name}`,
        });
      }
    } catch (error) {
      console.error('Error al seleccionar archivo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo seleccionar el archivo.',
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedUser || !file) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Debes seleccionar un usuario y un archivo.',
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('file', blob, file.name);
      } else {
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        });
      }

      formData.append('user_id', selectedUser.id);
      formData.append('type', activeTab);

      const endpoint =
        activeTab === 'factura'
          ? `${API_URL}/${selectedUser.id}/facturas`
          : `${API_URL}/${selectedUser.id}/nominas`;

      await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Archivo subido correctamente.',
      });

      setFile(null);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al subir archivo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo subir el archivo.',
      });
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userCard,
        selectedUser?.id === item.id && styles.selectedUserCard,
      ]}
      onPress={() => {
        setSelectedUser(item);
        Toast.show({
          type: 'info',
          text1: 'Usuario seleccionado',
          text2: item.name,
        });
      }}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userRole}>{item.role}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.viewFilesButton}
        onPress={() => {
          router.push('/control-panel/see-files');
          Toast.show({ type: 'info', text1: 'Redirigiendo', text2: 'Viendo archivos...' });
        }}
      >
        <Text style={styles.viewFilesButtonText}>Ver Todos los Archivos</Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'factura' ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab('factura')}
        >
          <Text style={styles.tabText}>Subir Factura</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'nomina' ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab('nomina')}
        >
          <Text style={styles.tabText}>Subir Nómina</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={users} keyExtractor={(item) => item.id.toString()} renderItem={renderUser} contentContainerStyle={styles.userList} />

      <TouchableOpacity style={styles.selectFileButton} onPress={pickDocument}>
        <Text style={styles.selectFileButtonText}>{file ? `Archivo: ${file.name}` : 'Seleccionar Archivo'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.uploadButton, (!file || !selectedUser) && styles.disabledButton]} onPress={handleUpload} disabled={!file || !selectedUser}>
        <Text style={styles.uploadButtonText}>Subir Archivo</Text>
      </TouchableOpacity>

      <Toast /> {/* ✅ Importante para mostrar los toasts */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7edea',
  },
  viewFilesButton: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  viewFilesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  inactiveTab: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  userList: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedUserCard: {
    backgroundColor: '#4CAF50',
  },
  selectFileButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
