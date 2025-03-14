import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import Toast from 'react-native-toast-message';

import CONFIG from '../../assets/config';
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LanguageSwitcher from "../../components/LanguageSwitcher"; // 🔹 Selector de idioma

export default function FilesScreen() {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("nominas");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchFiles(activeTab);
    }
  }, [activeTab, userRole]);

  const fetchUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);

      if (role === "cliente") {
        setActiveTab("facturas");
      } else {
        setActiveTab("nominas");
      }
    } catch (error) {
      console.error(t('files.errorRole'), error);
      Toast.show({
        type: 'error',
        text1: t('files.error'),
        text2: t('files.errorRole'),
      });
    }
  };

  const fetchFiles = async (type) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t('files.noToken'));
      }

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error(t('files.noUserId'));
      }

      const endpoint =
        type === "nominas"
          ? `${CONFIG.API_BASE_URL}/user/${userId}/nominas`
          : `${CONFIG.API_BASE_URL}/user/${userId}/facturas`;

      console.log("📥 API URL:", endpoint);

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setFiles(response.data);
      setLoading(false);
    } catch (error) {
      console.error(t('files.loadError'), error);
      Toast.show({
        type: 'error',
        text1: t('files.error'),
        text2: error.response?.data?.message || t('files.loadError'),
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text>{t('files.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Selector de idioma en la parte superior */}
      <View style={styles.languageContainer}>
        <LanguageSwitcher />
      </View>

      <Text style={styles.title}>{t('files.title')}</Text>

      {/* Tabs para cambiar entre nóminas y facturas */}
      <View style={styles.tabContainer}>
        {(userRole === "artista" ||
          userRole === "socorrista" ||
          userRole === "animador") && (
          <TouchableOpacity
            style={[styles.tab, activeTab === "nominas" && styles.activeTab]}
            onPress={() => setActiveTab("nominas")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "nominas" && styles.activeTabText,
              ]}
            >
              {t('files.nominas')}
            </Text>
          </TouchableOpacity>
        )}

        {userRole === "cliente" && (
          <TouchableOpacity
            style={[styles.tab, activeTab === "facturas" && styles.activeTab]}
            onPress={() => setActiveTab("facturas")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "facturas" && styles.activeTabText,
              ]}
            >
              {t('files.facturas')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fileCard}>
            <Text style={styles.fileName}>{item.file_name}</Text>
            <Text style={styles.fileDate}>
              {t('files.uploadedOn')}: {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.fileList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  languageContainer: { 
    position: 'absolute', 
    top: 20, 
    right: 20 
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20, textAlign: "center" },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  tab: { padding: 10, borderRadius: 5, backgroundColor: "#E68519" },
  activeTab: { backgroundColor: "#D46B08" },
  tabText: { fontSize: 16, color: "#333" },
  activeTabText: { color: "#fff", fontWeight: "bold" },
  fileCard: { backgroundColor: "#f7f7f7", padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  fileName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  fileDate: { fontSize: 14, color: "#666" },
});
