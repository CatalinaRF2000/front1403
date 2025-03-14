import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../../assets/config';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const API_URL = `${CONFIG.API_BASE_URL}`;

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('login.fill_all_fields'),
      });
      return;
    }

    try {
      console.log(t('login.attempting_login'), { email, password });
      
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      console.log(t('login.api_response'), response.data);
      
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('userId', user.id.toString());
      console.log(t('login.token_saved'), token);

      Toast.show({
        type: 'success',
        text1: t('login.success'),
        text2: `${t('login.welcome')}, ${user.name}`,
      });
      
      if (user.role === 'admin') {
        router.replace('/control-panel');
      } else {
        router.replace('/user');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(t('login.axios_error'), error.response?.data || error.message);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('login.invalid_credentials'),
        });
      } else {
        console.error(t('login.unknown_error'), error);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('login.unexpected_error'),
        });
      }
    }
  };

  const handleForgotPassword = () => {
    const email = 'info@allshows.es';
    const subject = encodeURIComponent(t('login.password_reset_request'));
    const body = encodeURIComponent(t('login.password_reset_body'));
    const mailtoURL = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoURL).catch((err) => console.error(t('login.email_open_error'), err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('login.title')}</Text>

        <TextInput
          style={styles.input}
          placeholder={t('login.email')}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder={t('login.password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t('login.submit')}</Text>
        </TouchableOpacity>

        

        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>{t('login.forgot_password')}</Text>
        </TouchableOpacity>
      </View>
      <Toast />
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
    marginBottom: 25,
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#333',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E68519',
  },
  forgotPasswordContainer: {
    marginTop: 15,
  },
  forgotPasswordText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgb(83, 83, 83)',
  },
});
