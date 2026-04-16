import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNav from '../components/BottomNav';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const PrivacyPolicyScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  const PolicySection = ({ icon, title, content }) => (
    <View style={[styles.sectionCard, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={icon} size={20} color="#fff" />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
        {content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.brandText, { color: colors.primary }]}>{t('PPTitle')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.introSection}>
          <Text style={[styles.mainHeading, { color: colors.text }]}>{t('PPHeading')}</Text>
          <Text style={[styles.updateDate, { color: colors.textSecondary }]}>{t('ToSDate')}</Text>
          <View style={styles.titleUnderline} />
        </View>

        <PolicySection 
          icon="shield-account-outline"
          title={t('PPSec1T')}
          content={t('PPSec1D')}
        />

        <PolicySection 
          icon="account-settings-outline"
          title={t('PPSec2T')}
          content={t('PPSec2D')}
        />

        <PolicySection 
          icon="database-lock-outline"
          title={t('PPSec3T')}
          content={t('PPSec3D')}
        />

        <PolicySection 
          icon="share-off-outline"
          title={t('PPSec4T')}
          content={t('PPSec4D')}
        />

        <PolicySection 
          icon="account-eye-outline"
          title={t('PPSec5T')}
          content={t('PPSec5D')}
        />

        <PolicySection 
          icon="bell-ring-outline"
          title={t('PPSec6T')}
          content={t('PPSec6D')}
        />

        <View style={styles.footerNote}>
          <MaterialCommunityIcons name="lock-check-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.footerNoteText, { color: colors.textSecondary }]}>
            {t('PPFooter')}
          </Text>
        </View>

      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  introSection: {
    paddingTop: 30,
    marginBottom: 35,
  },
  mainHeading: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
    marginBottom: 8,
  },
  updateDate: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 15,
  },
  titleUnderline: {
    width: 60,
    height: 5,
    backgroundColor: '#d35400',
    borderRadius: 3,
  },
  sectionCard: {
    padding: 22,
    borderRadius: 15,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#a04000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sectionContent: {
    fontSize: 13,
    lineHeight: 22,
    fontWeight: '600',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  footerNoteText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default PrivacyPolicyScreen;
