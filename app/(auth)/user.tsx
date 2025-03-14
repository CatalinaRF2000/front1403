import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, ActivityIndicator, 
    TouchableOpacity 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CONFIG from '../../assets/config';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../../components/LanguageSwitcher"; // 🔹 Importar el selector de idioma

export default function HomeScreen() {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const API_URL = `${CONFIG.API_BASE_URL}`;

    type User = {
        id: number;
        name: string;
        email: string;
        role: string;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    Toast.show({
                        type: 'error',
                        text1: t('user.error'),
                        text2: t('user.noToken'),
                    });
                    router.replace('/'); 
                    return;
                }

                const response = await axios.get(`${API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);
            } catch (error) {
                console.error(t('user.fetchError'), error);
                Toast.show({
                    type: 'error',
                    text1: t('user.error'),
                    text2: t('user.dataError'),
                });
                router.replace('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            router.replace('/');
        } catch (error) {
            console.error(t('user.logoutError'), error);
            Toast.show({
                type: 'error',
                text1: t('user.error'),
                text2: t('user.logoutErrorMsg'),
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#f4511e" />
                <Text>{t('user.loading')}</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{t('user.noData')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 🔹 Selector de idioma en la parte superior */}
            <View style={styles.languageContainer}>
                <LanguageSwitcher />
            </View>

            {/* Datos del usuario */}
            <Text style={styles.title}>{t('user.welcome', { name: user.name })}</Text>
            <Text style={styles.subtitle}>{t('user.account', { role: user.role })}</Text>

            {/* Botones */}
            <TouchableOpacity style={styles.button} onPress={() => router.push('/calendar')}>
                <Text style={styles.buttonText}>{t('user.calendar')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/files')}>
                <Text style={styles.buttonText}>{t('user.files')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.grayButton} onPress={() => router.push('/change-password')}>
                <Text style={styles.grayButtonText}>{t('user.changePassword')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>{t('user.logout')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    languageContainer: { // 🔹 Contenedor para el selector de idioma
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    subtitle: { fontSize: 18, color: '#666', marginBottom: 10 },
    button: { width: '80%', height: 50, backgroundColor: 'rgb(234, 133, 25)', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginVertical: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    grayButton: { width: '80%', height: 50, backgroundColor: '#cccccc', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 20 },
    grayButtonText: { color: '#333', fontSize: 18, fontWeight: 'bold' },
    logoutButton: { width: '80%', height: 50, backgroundColor: '#ff4d4d', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 20 },
    logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    errorText: { color: 'red', fontSize: 16 },
});
