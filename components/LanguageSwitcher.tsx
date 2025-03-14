import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          i18n.language === "es" && styles.activeButton,
        ]}
        onPress={() => changeLanguage("es")}
      >
        <Image
          source={require("../assets/flags/esp.jpg")} // 📌 Añade la bandera de España
          style={styles.flag}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          i18n.language === "en" && styles.activeButton,
        ]}
        onPress={() => changeLanguage("en")}
      >
        <Image
          source={require("../assets/flags/eng.jpg")} // 📌 Añade la bandera de Reino Unido
          style={styles.flag}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          i18n.language === "de" && styles.activeButton,
        ]}
        onPress={() => changeLanguage("de")}
      >
        <Image
          source={require("../assets/flags/deu.jpg")} // 📌 Añade la bandera de Alemania
          style={styles.flag}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Espaciado entre las banderas
  },
  button: {
    backgroundColor: "#D3D3D3", // Color de fondo para los no seleccionados
    padding: 6,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#E68519", // Color naranja para el idioma seleccionado
  },
  flag: {
    width: 30, // Ajusta el tamaño de la bandera
    height: 20,
    resizeMode: "contain",
  },
});
