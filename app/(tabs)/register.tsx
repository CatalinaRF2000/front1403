import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import CONFIG from '../../assets/config';
import { useTranslation } from 'react-i18next'; // Importa useTranslation

export default function RegisterScreen() {
  const { t } = useTranslation(); // Obtén el hook de traducción
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const API_URL = `${CONFIG.API_BASE_URL}`;

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t('register.error'), t('register.allFieldsRequired'));
      return;
    }
  
    if (password.length < 8) {
      Alert.alert(t('register.error'), t('register.passwordTooShort'));
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert(t('register.error'), t('register.passwordsDontMatch'));
      return;
    }
  
    try {
      console.log('Intentando registrar con:', { name, email, password });
  
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
  
      console.log('Respuesta de la API:', response.data);
      Alert.alert(t('register.success'), t('register.accountCreated'));
      router.replace('/login');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      Alert.alert(t('register.error'), error.response?.data?.message || t('register.registrationFailed'));
    }
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('register.createAccount')}</Text>

        {/* Campo de Nombre */}
        <TextInput
          style={styles.input}
          placeholder={t('register.name')}
          value={name}
          onChangeText={setName}
        />

        {/* Campo de Correo */}
        <TextInput
          style={styles.input}
          placeholder={t('register.email')}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Campo de Contraseña */}
        <TextInput
          style={styles.input}
          placeholder={t('register.password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Campo de Confirmar Contraseña */}
        <TextInput
          style={styles.input}
          placeholder={t('register.confirmPassword')}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Botón de Registrarse */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>{t('register.register')}</Text>
        </TouchableOpacity>

        {/* Enlace a Iniciar Sesión */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>{t('register.alreadyHaveAccount')}</Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.loginLink}>{t('register.login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#E68519',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#333',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E68519',
  },
});
