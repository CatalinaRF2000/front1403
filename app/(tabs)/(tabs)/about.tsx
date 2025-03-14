import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function WorkWithUsScreen() {
  const { t } = useTranslation(); // Para traducir los textos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const subject = encodeURIComponent(t("form.subject"));
    const body = encodeURIComponent(`${t("form.name")}: ${name}\n${t("form.email")}: ${email}\n${t("form.message")}: ${message}`);

    const mailtoUrl = `mailto:info@allshows.es?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl);
  };

  const { width } = Dimensions.get('window');
  const isDesktop = width >= 768; // Detectar pantallas grandes (PC/tablet)

  return (
    <ScrollView contentContainerStyle={[styles.container, isDesktop && styles.desktopContainer]}>
      {/* Formulario de contacto */}
      <View style={[styles.formContainer, isDesktop && styles.formDesktop]}>
        <Text style={styles.formTitle}>{t("form.title")}</Text>

        <TextInput
          style={styles.input}
          placeholder={t("form.name")}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder={t("form.email")}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder={t("form.message")}
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t("form.send")}</Text>
        </TouchableOpacity>
      </View> 

      {/* Botón WhatsApp */}
      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={() => {
          const phoneNumber = '+34657048870';
          const url = `https://wa.me/${phoneNumber}`;
          Linking.openURL(url);
        }}
      >
        <FontAwesome name="whatsapp" size={40} color="white" />
        <Text style={styles.whatsappButtonText}>{t("whatsapp.chat")}</Text>
      </TouchableOpacity>

      {/* Bloque de información */}
      <View style={styles.infoBlock}>
        <Text style={styles.infoTitle}>{t("mission.title")}</Text>
        <Text style={styles.infoText}>{t("mission.description")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  desktopContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  formDesktop: {
    width: '100%',
    maxWidth: 500, // Ancho máximo para pantallas grandes
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#f4511e',
  },
  input: {
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#rgb(234, 133, 25)',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  whatsappButtonText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
  },
  infoBlock: {
    backgroundColor: '#f7edea',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
});
