import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";

export default function AnimacionTuristicaScreen() {
  const { width } = Dimensions.get("window");
  const { t } = useTranslation(); // Hook para traducir

  const handleWhatsApp = () => {
    const phoneNumber = "34657048870"; 
    const message = encodeURIComponent(t("animation.whatsappMessage"));
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    Linking.openURL(url).catch((err) => console.error("Error al abrir WhatsApp:", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen de encabezado */}
      <Image
        source={require("../../../assets/images/agua.jpg")}
        style={[styles.headerImage, { height: width > 800 ? 400 : width * 0.5 }]}
        resizeMode="cover"
      />

      {/* Contenido principal */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t("animation.title")}</Text>
        <Text style={styles.description}>{t("animation.description")}</Text>

        {/* Sección de características */}
        <View style={styles.features}>
          <Text style={styles.subtitle}>{t("animation.featuresTitle")}</Text>
          <View style={styles.listContainer}>
            <Text style={styles.featureItem}>• {t("animation.feature1")}</Text>
            <Text style={styles.featureItem}>• {t("animation.feature2")}</Text>
            <Text style={styles.featureItem}>• {t("animation.feature3")}</Text>
          </View>
        </View>

        {/* Imagen ilustrativa */}
        <Image
          source={require("../../../assets/images/animacion-banner.jpg")}
          style={styles.illustrationImage}
          resizeMode="cover"
        />

        {/* Llamado a la acción */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>{t("animation.ctaText")}</Text>
          <Text style={styles.ctaSubText}>{t("animation.ctaSubText")}</Text>

          {/* Botón de WhatsApp */}
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Text style={styles.whatsappButtonText}>{t("animation.whatsappButton")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingBottom: 30,
  },
  headerImage: {
    width: "100%",
    maxHeight: 400,
  },
  contentContainer: {
    width: "90%",
    maxWidth: 800,
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#rgb(234, 133, 25)",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#333",
    lineHeight: 26,
    textAlign: "justify",
    marginBottom: 20,
  },
  features: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  featureItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  illustrationImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginVertical: 20,
  },
  ctaContainer: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  ctaText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  ctaSubText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    borderRadius: 8,
    padding: 15,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
