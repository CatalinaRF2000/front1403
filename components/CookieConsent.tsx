import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkConsent = async () => {
      const consent = await AsyncStorage.getItem("cookieConsent");
      if (!consent) {
        setVisible(true);
      }
    };
    checkConsent();
  }, []);

  const acceptCookies = async () => {
    await AsyncStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const rejectCookies = async () => {
    await AsyncStorage.setItem("cookieConsent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Usamos cookies para mejorar tu experiencia. ¿Aceptas?
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={acceptCookies} style={styles.acceptButton}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={rejectCookies} style={styles.rejectButton}>
          <Text style={styles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  acceptButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CookieConsent;
