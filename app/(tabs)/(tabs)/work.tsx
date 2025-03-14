import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function WorkWithUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    alert('Formulario enviado!');
  };

  const { width } = Dimensions.get('window');
  const isDesktop = width >= 768; // Detectar pantallas grandes (PC/tablet)

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <ScrollView contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}>
        {/* Sección de Javier */}
        <View style={styles.javierSection}>
          <View style={styles.javierImageContainer}>
          </View>
          <Text style={styles.javierText}>
            ¡Hola! Soy Javi Romero, CEO de Allshows. Si estás interesado en formar parte de nuestro equipo, ¡contáctame!
          </Text>
        </View>

        {/* Botón WhatsApp */}
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => {
            const phoneNumber = '1234567890';
            const url = `https://wa.me/${phoneNumber}`;
            Linking.openURL(url);
          }}
        >
          <FontAwesome name="whatsapp" size={40} color="white" />
          <Text style={styles.whatsappButtonText}>¡Chatea con nosotros en WhatsApp!</Text>
        </TouchableOpacity>

        <Text style={styles.javierText}>
            O bien... 
          </Text>

        {/* Formulario de contacto */}
        <View style={[styles.formContainer, isDesktop && styles.formDesktop]}>
          <Text style={styles.formTitle}>Formulario de Contacto</Text>

          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Tu email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Tu mensaje"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desktopContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40, // Asegura que el contenido esté centrado verticalmente
  },
  content: {
    padding: 20,
  },
  desktopContent: {
    width: '100%',
    maxWidth: 450, // Limitar el ancho máximo en pantallas grandes para que sea más pequeño, como una tarjeta
    alignSelf: 'center', // Centra el contenido horizontalmente
  },

  // Sección de Javier
  javierSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  javierImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#f4511e',
  },
  javierImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  javierText: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Botón WhatsApp
  whatsappButton: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  whatsappButtonText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
  },

  // Formulario de contacto
  formContainer: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  formDesktop: {
    width: '100%',
    maxWidth: 400, // Limitar el ancho máximo en pantallas grandes a 400px para hacerlo más pequeño, como una tarjeta
    alignSelf: 'center', // Centra el formulario en pantallas grandes
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Sombra en Android
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
