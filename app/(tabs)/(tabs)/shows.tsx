import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, useWindowDimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ShowsScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const numColumns = width < 400 ? 2 : 3;

  const categories = [
    { name: 'Visuales', subcategories: ['Flamenco Danza', 'Infantil Magia'] },
    { name: 'Live', subcategories: ['Duo', 'Solista', 'Tríos Bandas'] },
    { name: 'Tributos', subcategories: [] },
    { name: 'Exclusivas', subcategories: [] }
  ];

  const imagePaths = {
    'Exclusivas': [
      require('../../../assets/images/exclusivas/conde_int.png'),
      require('../../../assets/images/exclusivas/conde_lat.png'),
      require('../../../assets/images/exclusivas/mj.png'),
      require('../../../assets/images/exclusivas/revival.jpeg'),
      require('../../../assets/images/exclusivas/sam.png'),
      require('../../../assets/images/exclusivas/tenor.png'),
      require('../../../assets/images/exclusivas/vili.jpg'),
      require('../../../assets/images/exclusivas/yulia.jpg'),
    ],
    'Duo': [
      require('../../../assets/images/live/duo/american.png'),
      require('../../../assets/images/live/duo/conde_int.png'),
      require('../../../assets/images/live/duo/deep.png'),
      require('../../../assets/images/live/duo/immortals.jpg'),
      require('../../../assets/images/live/duo/jango.png'),
    ],
    'Solista': [
      require('../../../assets/images/live/solista/claudia.jpg'),
      require('../../../assets/images/live/solista/francina.jpg'),
      require('../../../assets/images/live/solista/jovan.png'),
      require('../../../assets/images/live/solista/leo.png'),
      require('../../../assets/images/live/solista/soulcat.jpg'),
      require('../../../assets/images/live/solista/tenor.png'),
      require('../../../assets/images/live/solista/vili.jpg'),
      require('../../../assets/images/live/solista/yulia.jpg'),
    ],
    'Tríos Bandas': [
      require('../../../assets/images/live/trios_bandas/bplan.png'),
      require('../../../assets/images/live/trios_bandas/freesouls.jpg'),
      require('../../../assets/images/live/trios_bandas/sam.png'),
      require('../../../assets/images/live/trios_bandas/samba.png'),
    ],
    'Tributos': [
      require('../../../assets/images/tributos/abba.jpg'),
      require('../../../assets/images/tributos/mj.png'),
      require('../../../assets/images/tributos/teddy.png'),
      require('../../../assets/images/tributos/tina.png'),
    ],
    'Flamenco Danza': [
      require('../../../assets/images/visuales/flamenco_danza/brasil.png'),
      require('../../../assets/images/visuales/flamenco_danza/emilio.png'),
      require('../../../assets/images/visuales/flamenco_danza/luces.png'),
      require('../../../assets/images/visuales/flamenco_danza/spanish.jpg'),
      require('../../../assets/images/visuales/flamenco_danza/revival.jpeg'),
    ],
    'Infantil Magia': [
      require('../../../assets/images/visuales/infantil_magia/banton.png'),
      require('../../../assets/images/visuales/infantil_magia/barbara.png'),
      require('../../../assets/images/visuales/infantil_magia/miraggio.jpg'),
      require('../../../assets/images/visuales/infantil_magia/reality.png'),
      require('../../../assets/images/visuales/infantil_magia/double.png'),
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t("shows.title")}</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item.name && styles.categoryButtonSelected]}
            onPress={() => {
              setSelectedCategory(selectedCategory === item.name ? null : item.name);
              setSelectedSubcategory(null);
            }}>
            <Text style={styles.categoryText}>{t(`shows.categories.${item.name}`)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />

      {selectedCategory && categories.find(c => c.name === selectedCategory)?.subcategories.length > 0 && (
        <FlatList
          data={categories.find(c => c.name === selectedCategory)?.subcategories || []}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.subcategoryButton, selectedSubcategory === item && styles.subcategoryButtonSelected]}
              onPress={() => setSelectedSubcategory(selectedSubcategory === item ? null : item)}>
              <Text style={styles.subcategoryText}>{t(`shows.subcategories.${item}`)}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />
      )}

      <FlatList
        key={(selectedSubcategory || selectedCategory) ?? 'default'}
        data={imagePaths[selectedSubcategory || selectedCategory] || []}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        removeClippedSubviews
        initialNumToRender={6}
        renderItem={({ item }) => (
          <View style={[styles.showCard, { width: width / numColumns - 20 }]}>            
            <Image source={item} style={styles.showImage} resizeMode="contain" />
          </View>
        )}
        contentContainerStyle={styles.showList}
      />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#112239',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F1F1F1',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  categoryList: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#FFD95A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  categoryButtonSelected: {
    backgroundColor: '#FFB74A',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112239',
  },
  showList: {
    marginTop: 10,
    alignItems: 'center',
  },
  showCard: {
    backgroundColor: '#2D3B5E',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
  },
  showImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  subcategoryButton: {
    backgroundColor: 'rgb(225, 186, 69)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  subcategoryButtonSelected: {
    backgroundColor: '#357ABD',
  },
  subcategoryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
