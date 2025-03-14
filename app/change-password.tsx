import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CONFIG from '../assets/config';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../components/LanguageSwitcher"; // Componente de cambio de idioma

export default function ChangePasswordScreen() {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const API_URL = `${CONFIG.API_BASE_URL}`;

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert(t('error.title'), t('error.fillAllFields'));
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert(t('error.title'), t('error.passwordMismatch'));
            return;
        }

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert(t('error.title'), t('error.noToken'));
                router.replace('/'); 
                return;
            }

            const response = await axios.post(
                `${API_URL}/change-password`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('Respuesta de la API:', response.data);
            Alert.alert(t('success.title'), t('success.passwordChanged'));
            router.replace('/user');
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            if (axios.isAxiosError(error)) {
                Alert.alert(t('error.title'), error.response?.data?.message || t('error.generic'));
            } else {
                Alert.alert(t('error.title'), t('error.generic'));
            }
        }
    };

    return (
        <View style={styles.container}>
            <LanguageSwitcher /> {/* 🔹 Agregado botón de cambio de idioma */}
            <Text style={styles.title}>{t('password.changeTitle')}</Text>

            <TextInput
                style={styles.input}
                placeholder={t('password.current')}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />

            <TextInput
                style={styles.input}
                placeholder={t('password.new')}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TextInput
                style={styles.input}
                placeholder={t('password.confirm')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>{t('password.updateButton')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/user')}>
                <Text style={styles.backButtonText}>{t('password.back')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    input: { width: '80%', height: 50, backgroundColor: '#f9f9f9', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
    button: { width: '80%', height: 50, backgroundColor: '#f4511e', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    backButton: { marginTop: 20, paddingVertical: 10 },
    backButtonText: { color: '#333', fontSize: 16, textDecorationLine: 'underline' },
});
