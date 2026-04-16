import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenContainer from '../components/ScreenContainer';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const InputField = ({ label, placeholder, value, onChangeText, keyboardType = 'default', dark, colors }) => (
  <View style={styles.inputContainer}>
    <Text style={[styles.inputLabel, { color: dark ? '#aaa' : '#555' }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: dark ? '#2a2a2a' : '#eaeaea' }]}>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={dark ? '#777' : '#999'}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const CheckOut = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  
  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // To avoid crash if items are undefined, fallback to []
  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalAmount = useSelector((state) => state.cart.totalAmount) || 0;

  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateForm, setStateForm] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);

  // Constants to match screenshot exactly
  const primaryColor = colors.primary || '#d35400';
  const bgColor = dark ? '#121212' : '#fcfcfc';
  const containerBg = dark ? '#1e1e1e' : '#f0f0f0';

  const shippingCost = 800; // E.g., Rs. 800 representing heavy load
  const taxCost = totalAmount * 0.05; // 5% tax example
  const finalTotal = totalAmount + shippingCost + taxCost;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>{t('CheckoutTitle')}</Text>
        <MaterialCommunityIcons name="lock" size={20} color={colors.headerText} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Steps Indicator */}
        <View style={styles.stepsContainer}>
          <View style={[styles.stepBox, { backgroundColor: primaryColor }]}>
            <Text style={styles.stepTextActive}>1</Text>
          </View>
          <View style={[styles.stepLine, { backgroundColor: '#ddd' }]} />
          <View style={[styles.stepBox, { backgroundColor: '#e0e0e0' }]}>
            <Text style={styles.stepTextInactive}>2</Text>
          </View>
          <View style={[styles.stepLine, { backgroundColor: '#ddd' }]} />
          <View style={[styles.stepBox, { backgroundColor: '#e0e0e0' }]}>
            <Text style={styles.stepTextInactive}>3</Text>
          </View>
          <Text style={[styles.stepLabel, { color: primaryColor }]}>{t('FillAddress')}</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>{t('WhereToDeliver')}</Text>
          <Text style={[styles.subTitle, { color: dark ? '#aaa' : '#666' }]}>
            {t('DeliveryDesc')}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <InputField 
            label={t('YourName')} 
            placeholder={t('WriteYourName')} 
            value={fullName} onChangeText={setFullName} 
            dark={dark} colors={colors} 
          />
          <InputField 
            label={t('Address')} 
            placeholder={t('AddressDesc')} 
            value={address1} onChangeText={setAddress1} 
            dark={dark} colors={colors} 
          />
          <InputField 
            label={t('NearbyLandmark')} 
            placeholder={t('CommonPlace')} 
            value={address2} onChangeText={setAddress2} 
            dark={dark} colors={colors} 
          />
          <InputField 
            label={t('City')} 
            placeholder={t('CityDesc')} 
            value={city} onChangeText={setCity} 
            dark={dark} colors={colors} 
          />
          <InputField 
            label={t('State')} 
            placeholder={t('StateDesc')} 
            value={stateForm} onChangeText={setStateForm} 
            dark={dark} colors={colors} 
          />
          <InputField 
            label={t('ZipCode')} 
            placeholder={t('ZipCodeDesc', '48201')} 
            value={zipCode} onChangeText={setZipCode} 
            dark={dark} colors={colors} 
          />
          <InputField 
            label={t('PhoneNumber')} 
            placeholder={t('PhoneDesc', '+1 (555) 000-0000')} 
            value={phone} onChangeText={setPhone} 
            keyboardType="phone-pad"
            dark={dark} colors={colors} 
          />

          {/* Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setSaveAddress(!saveAddress)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={saveAddress ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={saveAddress ? primaryColor : (dark ? '#777' : '#999')} 
            />
            <Text style={[styles.checkboxText, { color: dark ? '#ccc' : '#555' }]}>
              {t('SaveAddress')}
            </Text>
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity 
            style={[styles.continueBtn, { backgroundColor: primaryColor }]}
            onPress={() => navigation.navigate('Payment')}
          >
            <Text style={styles.continueBtnText}>{t('NextPayMoney')}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={[styles.summaryContainer, { backgroundColor: containerBg }]}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>{t('MyItems')}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems.length} {t('Items', 'ITEMS')}</Text>
            </View>
          </View>

          {cartItems.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <Image 
                source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
                style={styles.itemImage} 
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.itemSku}>{t('ItemCode', 'ITEM ID: ')}{item.sku || 'N/A'}</Text>
                <Text style={[styles.itemPrice, { color: primaryColor }]}>Rs. {item.priceValue?.toLocaleString() || '0'}</Text>
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalsRow}>
            <Text style={[styles.totalsLabel, { color: colors.text }]}>{t('SUBTOTAL')}</Text>
            <Text style={[styles.totalsValue, { color: colors.text }]}>Rs. {totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={[styles.totalsLabel, { color: colors.text }]}>{t('DeliveryFee')}</Text>
            <Text style={[styles.totalsValue, { color: colors.text }]}>Rs. {shippingCost.toLocaleString()}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={[styles.totalsLabel, { color: colors.text }]}>{t('GovtTax')}</Text>
            <Text style={[styles.totalsValue, { color: colors.text }]}>Rs. {taxCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>

          <View style={[styles.totalsRow, { marginTop: 15 }]}>
            <Text style={[styles.totalDueLabel, { color: colors.text }]}>{t('TOTALBILL')}</Text>
            <Text style={[styles.totalDueValue, { color: primaryColor }]}>
              Rs. {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={[styles.securityBox, { backgroundColor: dark ? '#222' : '#fff' }]}>
            <MaterialCommunityIcons name="shield-check" size={24} color={primaryColor} />
            <View style={styles.securityTextContainer}>
              <Text style={[styles.securityTitle, { color: colors.text }]}>{t('SafeSecure')}</Text>
              <Text style={styles.securityDesc}>
                {t('SecureDesc')}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerLogo, { color: primaryColor }]}>{t('WafaHardware')}</Text>
          <Text style={styles.footerTagline}>{t('BestItems')}</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkText}>{t('PrivacyPolicyNav')}</Text>
            <Text style={styles.footerLinkText}>{t('TermsofServiceNav')}</Text>
            <Text style={styles.footerLinkText}>{t('ContactUsHelpNav')}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  stepBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepTextInactive: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepLine: {
    width: 20,
    height: 1,
    marginHorizontal: 10,
  },
  stepLabel: {
    marginLeft: 15,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    fontWeight: '500',
    height: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
    paddingRight: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 16,
  },
  continueBtn: {
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  summaryContainer: {
    padding: 25,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginRight: 15,
  },
  badge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#0066cc',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  itemSku: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalsLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  totalsValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  totalDueLabel: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  totalDueValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  securityBox: {
    flexDirection: 'row',
    marginTop: 30,
    padding: 20,
    elevation: 2,
    alignItems: 'flex-start',
  },
  securityTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  securityTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },
  securityDesc: {
    fontSize: 10,
    color: '#888',
    lineHeight: 14,
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: 30,
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 5,
  },
  footerTagline: {
    fontSize: 9,
    color: '#888',
    letterSpacing: 1,
    marginBottom: 25,
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  footerLinkText: {
    fontSize: 9,
    color: '#445',
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default CheckOut;
