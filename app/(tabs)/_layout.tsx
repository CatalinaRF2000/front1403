import "../i18n.ts"; // ⚠ IMPORTANTE: Esto debe estar antes de cualquier otro import de `react-i18next`
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import CookieConsent from "../../components/CookieConsent"; 
import LanguageSwitcher from "../../components/LanguageSwitcher"; 
import {
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Layout() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const isMobile = width < 1200; 

  const handleDismissAll = () => {
    router.replace('/'); 
  };

  const navigateTo = (route: string) => {
    setIsMenuVisible(false);
    router.push(route);
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0B1445',
            borderBottomWidth: 1,
            borderBottomColor: 'rgb(255, 171, 45)',
          },
          headerTintColor: '#fff',
          headerTitle: () =>
            isMobile ? (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setIsMenuVisible(!isMenuVisible)}
              >
                <Ionicons name="menu" size={24} color="rgb(234, 133, 25)" />
              </TouchableOpacity>
            ) : (
              <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigateTo('/shows')}>
                  <Text style={styles.linkText}>{t("layout.shows")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo('/animacion')}>
                  <Text style={styles.linkText}>{t("layout.animation")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo('/socorrismo')}>
                  <Text style={styles.linkText}>{t("layout.lifeguard")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo('/eventos')}>
                  <Text style={styles.linkText}>{t("layout.events")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo('/about')}>
                  <Text style={styles.linkText}>{t("layout.contact")}</Text>
                </TouchableOpacity>
              </View>
            ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleDismissAll}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/allshows-logo.png')}
                  style={styles.logo}
                />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () =>
            !isMobile && (
              <View style={styles.headerRight}>
                <LanguageSwitcher />
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  style={styles.loginButton}
                >
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.loginText}>{t("layout.login")}</Text>
                </TouchableOpacity>
              </View>
            ),
        }}
      >
        <Stack.Screen name="(tabs)/index" options={{}} />
      </Stack>

      <CookieConsent />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("layout.footer")}</Text>
      </View>

      {/* Menú hamburguesa */}
      {isMobile && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isMenuVisible}
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuCloseButton} onPress={() => setIsMenuVisible(false)}>
              <Ionicons name="close" size={30} color="#fff" />
            </Pressable>
            <LanguageSwitcher />
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/shows')}>
              <Text style={styles.menuText}>{t("layout.shows")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/animacion')}>
              <Text style={styles.menuText}>{t("layout.animation")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/socorrismo')}>
              <Text style={styles.menuText}>{t("layout.lifeguard")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/eventos')}>
              <Text style={styles.menuText}>{t("layout.events")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/about')}>
              <Text style={styles.menuText}>{t("layout.contact")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/login')}>
              <Ionicons name="log-in-outline" size={24} color="#fff" />
              <Text style={styles.menuText}>{t("layout.login")}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "50%", // Un poco más flexible
    gap: 8, // Reducido para que los elementos estén más juntos
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  logo: {
    width: 80, // Reducido para que ocupe menos espacio
    height: 80, // Reducido para que ocupe menos espacio
    resizeMode: "contain",
  },

  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10, // Reducido margen
    backgroundColor: "rgb(234, 133, 25)", // Naranja vibrante
    paddingVertical: 8, // Reducido padding
    paddingHorizontal: 15, // Reducido padding
    borderRadius: 6, // Reducido borde
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Sombra en Android
  },
  loginText: {
    color: "rgb(255, 255, 255)", 
    fontWeight: "bold",
    fontSize: 16, // Reducido tamaño de fuente
    marginLeft: 6, // Reducido margen
  },

  linksContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los elementos se ajusten si no caben
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15, // Reducido margen
  },
  linkText: {
    color: "rgb(255, 255, 255)",
    fontWeight: "bold",
    fontSize: 16, // Reducido para mejor ajuste
    marginHorizontal: 10, // Reducido margen
  },

  menuButton: {
    marginLeft: 15, // Reducido margen
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "rgb(53, 61, 97)",
    paddingTop: 40, // Reducido padding
    paddingHorizontal: 15, // Reducido padding
  },
  menuCloseButton: {
    alignSelf: "flex-end",
    marginBottom: 15, // Reducido margen
  },
  menuItem: {
    marginVertical: 8, // Reducido margen
    paddingVertical: 8, // Reducido padding
    borderBottomWidth: 1,
    borderBottomColor: "rgb(255, 167, 0)",
  },
  menuText: {
    color: "#FFFFFF",
    fontSize: 18, // Reducido tamaño de fuente
    fontWeight: "bold",
  },

  footer: {
    alignItems: "center",
    paddingVertical: 8, // Reducido padding
    backgroundColor: "#0B1445",
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 10, // Reducido tamaño de fuente
  },
});
