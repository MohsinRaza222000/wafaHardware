import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNav from '../components/BottomNav';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ContactUsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dark ? '#121212' : '#fcf9f8' }]}>
      {/* custom header matching top of mockup */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={28} color="#d35400" />
        </TouchableOpacity>
        <Text style={styles.brandText}>{t('WafaHardware')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ShopFlow', { screen: 'Cart' })}>
           <MaterialCommunityIcons name="cart-outline" size={26} color="#4e5d6c" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Support Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: '#a04000' }]}>{t('ContactOurShop')}</Text>
          <Text style={styles.description}>
            {t('ContactDesc')}
          </Text>
        </View>

        {/* Main Shop Card */}
        <View style={[styles.hubCard, { backgroundColor: dark ? '#1e1e1e' : '#fff' }]}>
           <View style={styles.hubHeader}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#a04000" />
              <Text style={[styles.hubTitle, { color: colors.text }]}>{t('OurMainShop')}</Text>
           </View>
           
           <View style={styles.addressBlock}>
              <Text style={[styles.addressLineBold, { color: colors.text }]}>{t('ShopName')}</Text>
              <Text style={styles.addressLine}>{t('AddressL1')}</Text>
              <Text style={styles.addressLine}>{t('AddressL2')}</Text>
              <Text style={styles.addressLine}>{t('AddressL3')}</Text>
           </View>

           <TouchableOpacity 
             style={styles.callBtn} 
             onPress={() => Linking.openURL('tel:+97145550123')}
           >
              <MaterialCommunityIcons name="phone" size={18} color="#fff" />
              <Text style={styles.callBtnText}>03076782807</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             style={styles.emailBtn}
             onPress={() => Linking.openURL('mailto:contact@wafahardware.com')}
           >
              <MaterialCommunityIcons name="email" size={18} color="#4e5d6c" />
              <Text style={styles.emailBtnText}>contact@wafahardware.com</Text>
           </TouchableOpacity>

            <TouchableOpacity 
             style={styles.mapContainer}
             onPress={() => navigation.navigate('ShopFlow', { screen: 'MapScreen' })}
           >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' }} 
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapOverlay}>
                 <MaterialCommunityIcons name="google-maps" size={20} color="#fff" />
                 <Text style={styles.overlayText}>{t('ViewMap')}</Text>
              </View>
              <View style={styles.mapPin}>
                 <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
              </View>
           </TouchableOpacity>
        </View>


        {/* Operation Hours Dashboard */}
        <View style={styles.hoursCard}>
           <View style={styles.hoursHeader}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#fb6a00" />
              <Text style={styles.hoursTitle}>{t('OpeningTimes')}</Text>
           </View>

           <View style={styles.hoursList}>
              <HourRow day={t('Monday')} time="08:00 — 19:00" />
              <HourRow day={t('Tuesday')} time="08:00 — 19:00" />
              <HourRow day={t('Wednesday')} time="08:00 — 19:00" />
              <HourRow day={t('Thursday')} time="08:00 — 19:00" />
              <HourRow day={t('Friday')} time="08:00 — 12:00" highlight/>
              <HourRow day={t('Saturday')} time="09:00 — 19:00" />
              <HourRow day={t('Sunday')} time="08:00 — 19:00"/>
           </View>
        </View>

        {/* Consultation CTA Banner */}
        <View style={styles.consultationCard}>
           <Image 
             source={{ uri: 'file:///C:/Users/mohsi/.gemini/antigravity/brain/c57cfadb-587c-49a2-9d6d-b57c7670d5bd/warehouse_consultation_bg_1775565857388.png' }} 
             style={StyleSheet.absoluteFillObject} 
             resizeMode="cover"
           />
           <View style={styles.consultationOverlay}>
              <Text style={styles.consultationTitle}>{t('ConsultTitle')}</Text>
              <Text style={styles.consultationSubtitle}>
                {t('ConsultSub')}
              </Text>
              <TouchableOpacity 
                style={styles.contactBtn}
                onPress={() => Linking.openURL('mailto:experts@wafahardware.com')}
              >
                 <Text style={styles.contactBtnText}>{t('BookNow')}</Text>
              </TouchableOpacity>
           </View>
        </View>

      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

const HourRow = ({ day, time, highlight, isClosed }) => (
  <View style={styles.hourRow}>
    <Text style={styles.hourDay}>{day}</Text>
    <Text style={[
      styles.hourTime, 
      highlight && { color: '#fb6a00' },
      isClosed && { color: '#e74c3c' }
    ]}>
      {time}
    </Text>
  </View>
);

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
    color: '#d35400',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  titleSection: {
    paddingHorizontal: 25,
    paddingTop: 20,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 44,
    marginBottom: 15,
  },
  description: {
    fontSize: 13,
    color: '#7f8c8d',
    lineHeight: 20,
    fontWeight: '600',
  },
  hubCard: {
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 8,
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  hubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  hubTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 10,
  },
  addressBlock: {
    marginBottom: 25,
  },
  addressLineBold: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1b1c1c',
    marginBottom: 5,
  },
  addressLine: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '700',
    marginBottom: 2,
  },
  callBtn: {
    backgroundColor: '#a04000',
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  callBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 10,
  },
  emailBtn: {
    backgroundColor: '#e6efff',
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  emailBtnText: {
    color: '#4e5d6c',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 10,
  },
  mapContainer: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    backgroundColor: '#a04000',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  faqSection: {
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 25,
  },
  accordionContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    height: 70,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
    paddingRight: 10,
  },
  accordionBody: {
    padding: 20,
    paddingTop: 10,
  },
  answerText: {
    fontSize: 13,
    color: '#7f8c8d',
    lineHeight: 20,
    fontWeight: '600',
  },
  hoursCard: {
    marginHorizontal: 20,
    backgroundColor: '#1b1c1c',
    borderRadius: 12,
    padding: 25,
    marginBottom: 30,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  hoursTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 12,
  },
  hoursList: {
    width: '100%',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  hourDay: {
    color: '#a0acbd',
    fontSize: 13,
    fontWeight: '700',
  },
  hourTime: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  consultationCard: {
    marginHorizontal: 20,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 50,
  },
  consultationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 30,
    justifyContent: 'center',
  },
  consultationTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
  },
  consultationSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    marginBottom: 25,
    paddingRight: 40,
  },
  contactBtn: {
    backgroundColor: '#fb6a00',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default ContactUsScreen;
