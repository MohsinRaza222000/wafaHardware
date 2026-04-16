import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

const ProjectsScreen = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  return (
    <ScreenContainer>
      <Header />
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.subtitle, { color: colors.primary }]}>CUSTOM_SPECIFICATIONS</Text>
          <Text style={[styles.title, { color: colors.text }]}>Industrial Projects</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
         <View style={styles.promoBox}>
            <Text style={styles.promoTitle}>PLANNING A LARGE BUILD?</Text>
            <Text style={styles.promoDesc}>We provide customized glass and sheet cutting for large scale industrial and home projects.</Text>
         </View>

         <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>ONGOING_ESTIMATES</Text>
            <View style={[styles.projectCard, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
               <MaterialCommunityIcons name="pencil-ruler" size={32} color={colors.primary} />
               <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text style={[styles.projectTitle, { color: colors.text }]}>New Kitchen Cabinets</Text>
                  <Text style={styles.projectStatus}>STATUS: ESTIMATION_PENDING</Text>
               </View>
            </View>
         </View>

         <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            <Text style={styles.addBtnText}>BEGIN NEW PROJECT LOG</Text>
         </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backBtn: {
    marginRight: 15,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  promoBox: {
    backgroundColor: '#1a1a1a',
    padding: 25,
    borderRadius: 12,
    marginBottom: 30,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 1,
  },
  promoDesc: {
    color: '#888',
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 15,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  projectStatus: {
    fontSize: 9,
    color: '#F26B00',
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  addBtn: {
    height: 60,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default ProjectsScreen;
