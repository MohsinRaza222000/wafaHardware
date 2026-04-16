import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CATEGORIES } from '../config/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const getCategoryContent = (categoryName) => {
  const normalized = categoryName.toLowerCase();
  
  if (normalized.includes('door skin')) {
    return {
      icon: 'door-open',
      sublabelKey: 'CatEntrySub',
      descKey: 'CatEntryDesc',
      image: require("../assets/images/doorSkin-title.jpg"), 
    };
  }
  if (normalized.includes('cabinet sheet')) {
    return {
      icon: 'cabinet',
      sublabelKey: 'CatWoodSub',
      descKey: 'CatWoodDesc',
      image: require("../assets/images/cabinet-title.jpg"), 
    };
  }
  if (normalized.includes('tool')) {
    return {
      icon: 'hammer-wrench',
      sublabelKey: 'CatForgedSub',
      descKey: 'CatForgedDesc',
      image: require("../assets/images/tools-title.png"), 
    };
  }
  if (normalized.includes('paint')) {
    return {
      icon: 'format-paint',
      sublabelKey: 'CatPigmentSub',
      descKey: 'CatPigmentDesc',
      image: require("../assets/images/paints-title.jpg"), 
    };
  }
  if (normalized.includes('glass')) {
    return {
      icon: 'window-closed-variant',
      sublabelKey: 'CatWindowsSub',
      descKey: 'CatWindowsDesc',
      image: require("../assets/images/glass-title.jpg"), 
    };
  }
  if (normalized.includes('accessories')) {
    return {
      icon: 'format-list-bulleted-type',
      sublabelKey: 'CatProductSub',
      descKey: 'CatProductDesc',
      image: require("../assets/images/furniture.jpg"), 
    };
  }

  // Fallback
  return {
    icon: 'package-variant',
    sublabelKey: 'CatProductSub',
    descKey: 'CatProductDesc',
    image: require("../assets/images/logo.png"), 
  };
};


const CategoriesScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  return (
    <ScreenContainer style={{ backgroundColor: colors.background }}>
      <Header />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
        style={{ flex: 1 }}
      >
        <View style={[styles.headerSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.primary }]}>{t('AllShopItems')}</Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>{t('SearchToolsDesc')}</Text>
        </View>

        <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
          {CATEGORIES.map((category, index) => {
            const content = getCategoryContent(category);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation.navigate('ProductListing', { categoryName: category })}
                activeOpacity={0.9}
              >
                <View style={[styles.imageContainer, { backgroundColor: dark ? '#222' : '#f4f4f4' }]}>
                  <Image source={content.image} style={styles.cardImage} />
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.iconRow}>
                    <MaterialCommunityIcons name={content.icon} size={14} color={colors.primary} />
                    <Text style={[styles.sublabelText, { color: colors.textSecondary }]}>{t(content.sublabelKey)}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{t(category.replace(' ', '')) || category}</Text>
                  <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{t(content.descKey)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>{t('WEFIXCUTITEMS')}</Text>
          <Text style={styles.bannerDesc}>
            {t('FixCutDesc')}
          </Text>
          <TouchableOpacity style={styles.bannerButton} onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.bannerButtonText}>{t('ASKUSFORHELP')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerSection: {
    padding: 25,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#a04100', // Dark red/brown
    lineHeight: 34,
    marginBottom: 15,
  },
  desc: {
    color: '#8e7164',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  },
  listContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#f0eded',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f4f4f4',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 20,
    paddingBottom: 25,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sublabelText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8e7164',
    marginLeft: 6,
    letterSpacing: 1,
  },
  cardTitle: {
    color: '#1b1c1c',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  cardDesc: {
    color: '#8e7164',
    fontSize: 12,
    lineHeight: 18,
  },
  bannerContainer: {
    margin: 20,
    marginTop: 10,
    marginBottom: 40,
    padding: 30,
    backgroundColor: '#fb6a00',
    borderRadius: 4,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 15,
  },
  bannerDesc: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 25,
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    borderRadius: 2,
  },
  bannerButtonText: {
    color: '#fb6a00',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default CategoriesScreen;
