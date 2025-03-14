import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768; // Detecta si es móvil
  const { t } = useTranslation(); // Hook para traducir textos

  const artistInfo1 = [
    { image: require('../../../assets/images/tributos/mj.png') },
    { image: require('../../../assets/images/artista2.png') },
    { image: require('../../../assets/images/artista3.png') },
    { image: require('../../../assets/images/artista4.jpg') },
  ];

  const artistInfo2 = [
    { image: require('../../../assets/images/live/solista/vili.jpg') },
    { image: require('../../../assets/images/live/duo/conde_lat.png') },
    { image: require('../../../assets/images/visuales/flamenco_danza/revival.jpeg') },
    { image: require('../../../assets/images/tributos/teddy.png') },
  ];
  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sección de Introducción */}
      <View style={[styles.header, isMobile ? styles.headerMobile : styles.headerDesktop]}>
        <Text style={[styles.mainTitle, isMobile ? styles.mainTitleMobile : styles.mainTitleDesktop]}>
          {t('home.title')}
        </Text>
        <Text style={[styles.description, isMobile ? styles.descriptionMobile : styles.descriptionDesktop]}>
          {t('home.description')}
        </Text>
      </View>

      {/* Galería de Artistas - Responsiva */}
      <View style={[styles.artistsContainer, isMobile ? styles.artistsColumn : styles.artistsRow]}>
        {artistInfo1.map((artist, index) => (
          <View key={index} style={[styles.artistCard, isMobile ? styles.artistCardMobile : styles.artistCardDesktop]}>
            <Image source={artist.image} style={styles.image} />
          </View>
        ))}
      </View>

      {/* Sección de Servicios */}
      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>{t('home.servicesTitle')}</Text>
        <View style={styles.serviceList}>
          <Text style={styles.serviceItem}>🎭 {t('home.service1')}</Text>
          <Text style={styles.serviceItem}>🎶 {t('home.service2')}</Text>
          <Text style={styles.serviceItem}>🎤 {t('home.service3')}</Text>
          <Text style={styles.serviceItem}>🏨 {t('home.service4')}</Text>
        </View>
      </View>
 {/* Galería de Artistas - Responsiva */}
 <View style={[styles.artistsContainer, isMobile ? styles.artistsColumn : styles.artistsRow]}>
        {artistInfo2.map((artist, index) => (
          <View key={index} style={[styles.artistCard, isMobile ? styles.artistCardMobile : styles.artistCardDesktop]}>
            <Image source={artist.image} style={styles.image} />
          </View>
        ))}
      </View>
      {/* Sección de Contacto */}
      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>{t('home.contactTitle')}</Text>
        
        <Text style={styles.contactText}>📍 Camí Vell de Bunyola 43</Text>
        <Text style={styles.contactText}>07009 Palma (Son Castelló)</Text>

        <TouchableOpacity onPress={() => Linking.openURL('https://maps.app.goo.gl/9rckcfWEBx2SK2HJA')}>
          <Text style={[styles.contactText, { color: '#1E88E5', textDecorationLine: 'underline' }]}>
            {t('home.openMaps')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.contactText}>📞 {t('home.phone')}: +34 91 999 29 29</Text>
        <Text style={styles.contactText}>📧 {t('home.email')}: info@allshows.es</Text>
      </View>

      <View style={styles.socialMediaContainer}>
  <Text style={styles.socialMediaTitle}>{t('home.followUs')}</Text>
  <View style={styles.socialMediaIcons}>
    <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/allshows2019/')}>
      <Ionicons name="logo-instagram" size={30} color="#E1306C" style={styles.icon} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => Linking.openURL('https://m.facebook.com/allshows2019/')}>
      <Ionicons name="logo-facebook" size={30} color="#3b5998" style={styles.icon} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => Linking.openURL('https://x.com/allshowsplus')}>
      <Ionicons name="logo-twitter" size={30} color="#1DA1F2" style={styles.icon} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/@allshows2019')}>
      <Ionicons name="logo-youtube" size={30} color="rgb(234, 18, 18)" style={styles.icon} />
    </TouchableOpacity>
  </View>
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#112239',
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: 'rgb(65, 95, 150)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 1300,
    marginBottom: 40,
  },
  headerDesktop: {
    paddingVertical: 50,
  },
  headerMobile: {
    paddingVertical: 30,
  },
  mainTitle: {
    fontWeight: 'bold',
    color: '#FFD95A',
    textAlign: 'center',
    marginBottom: 10,
  },
  mainTitleDesktop: {
    fontSize: 50,
  },
  mainTitleMobile: {
    fontSize: 30,
  },
  description: {
    color: '#F1F1F1',
    textAlign: 'center',
    maxWidth: 800,
  },
  descriptionDesktop: {
    fontSize: 22,
  },
  descriptionMobile: {
    fontSize: 18,
  },
  artistsContainer: {
    width: '100%',
    maxWidth: 1200,
    marginBottom: 40,
  },
  artistsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  artistsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  artistCard: {
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#597AAA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  artistCardDesktop: {
    width: '22%',
    margin: 15,
  },
  artistCardMobile: {
    width: '90%',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  servicesContainer: {
    backgroundColor: '#273E69',
    padding: 30,
    borderRadius: 12,
    width: '90%',
    maxWidth: 1200,
    marginBottom: 40,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD95A',
    textAlign: 'center',
    marginBottom: 15,
  },
  serviceList: {
    alignItems: 'flex-start',
  },
  serviceItem: {
    fontSize: 20,
    color: '#F1F1F1',
    marginBottom: 10,
  },
  contactContainer: {
    backgroundColor: '#273E69',
    padding: 30,
    borderRadius: 12,
    width: '90%',
    maxWidth: 1200,
    marginBottom: 40,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD95A',
    textAlign: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 20,
    color: '#F1F1F1',
    marginBottom: 8,
  },
  socialMediaContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 1200,
    marginBottom: 40,
    alignItems: 'center',
  },
  socialMediaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112239',
    marginBottom: 15,
  },
  socialMediaIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  icon: {
    margin: 10,
  },
});
