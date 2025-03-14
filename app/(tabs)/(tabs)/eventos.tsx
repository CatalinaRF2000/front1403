import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";

export default function EventosEspecialesScreen() {
  const { t } = useTranslation();

  // Datos de eventos especiales con traducción
  const eventos = [
    {
      category: t("events.category1.title"),
      description: [
        t("events.category1.event1"),
        t("events.category1.event2"),
        t("events.category1.event3"),
      ],
    },
    {
      category: t("events.category2.title"),
      description: [
        t("events.category2.event1"),
        t("events.category2.event2"),
        t("events.category2.event3"),
      ],
    },
    {
      category: t("events.category3.title"),
      description: [
        t("events.category3.event1"),
        t("events.category3.event2"),
        t("events.category3.event3"),
      ],
    },
    {
      category: t("events.category4.title"),
      description: [
        t("events.category4.event1"),
        t("events.category4.event2"),
        t("events.category4.event3"),
      ],
    },
  ];

  // Función para abrir WhatsApp con un mensaje predefinido
  const handleWhatsApp = () => {
    const phoneNumber = "+34657048870"; // Número de WhatsApp
    const message = encodeURIComponent(t("events.whatsappMessage"));
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error al abrir WhatsApp", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("events.title")}</Text>

      {/* Caja principal que contiene toda la información */}
      <View style={styles.documentContainer}>
        {eventos.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{item.category}</Text>
            <View style={styles.listContainer}>
              {item.description.map((evento, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.eventText}>{evento}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Botón de WhatsApp */}
      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
        <Text style={styles.whatsappButtonText}>{t("events.whatsappButton")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#rgb(234, 133, 25)",
    textAlign: "center",
    marginBottom: 20,
  },
  documentContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 800,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  listContainer: {
    marginLeft: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 18,
    color: "#f4511e",
    marginRight: 8,
  },
  eventText: {
    fontSize: 16,
    color: "#666",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    width: "60%",
    maxWidth: 400,
    alignItems: "center",
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
