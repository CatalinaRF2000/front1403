import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from 'react-native';
import Toast from 'react-native-toast-message'; // ✅ Importamos Toast
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CONFIG from '../../../assets/config';

export default function CreateUser() {
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'cliente', password: '', password_confirmation: '' });

  const REGISTER_URL = `${CONFIG.API_BASE_URL}/admin/users`;

  const handleCreateUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No hay token de autenticación' });
        return;
      }

      // 🔥 Validaciones
      if (!newUser.name || !newUser.email || !newUser.password || !newUser.password_confirmation) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Todos los campos son obligatorios.' });
        return;
      }

      if (newUser.password.length < 8) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'La contraseña debe tener al menos 8 caracteres.' });
        return;
      }

      if (newUser.password !== newUser.password_confirmation) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Las contraseñas no coinciden.' });
        return;
      }

      await axios.post(
        REGISTER_URL,
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Usuario creado correctamente
      Toast.show({ type: 'success', text1: 'Usuario creado', text2: `"${newUser.name}" ha sido registrado.` });

      // 🔄 Limpiar formulario
      setNewUser({ name: '', email: '', role: 'cliente', password: '', password_confirmation: '' });

    } catch (error) {
      console.error('Error al crear usuario:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo crear el usuario.' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Usuario</Text>

      {/* Formulario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={newUser.name}
        onChangeText={(text) => setNewUser((prev) => ({ ...prev, name: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={newUser.email}
        onChangeText={(text) => setNewUser((prev) => ({ ...prev, email: text }))}
      />
      <Picker
        selectedValue={newUser.role}
        style={styles.picker}
        onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}
      >
        <Picker.Item label="Cliente" value="cliente" />
        <Picker.Item label="Admin" value="admin" />
        <Picker.Item label="Artista" value="artista" />
        <Picker.Item label="Socorrista" value="socorrista" />
        <Picker.Item label="Animador" value="animador" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={newUser.password}
        onChangeText={(text) => setNewUser((prev) => ({ ...prev, password: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        value={newUser.password_confirmation}
        onChangeText={(text) => setNewUser((prev) => ({ ...prev, password_confirmation: text }))}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>

      {/* Toast para mostrar los mensajes */}
      <Toast />
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
