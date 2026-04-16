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
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const InputField = ({ label, placeholder, value, onChangeText, keyboardType = 'default', icon, dark, colors, style }) => (
  <View style={[styles.inputContainer, style]}>
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
      {icon && (
        <MaterialCommunityIcons name={icon} size={20} color={dark ? '#777' : '#999'} style={styles.inputIcon} />
      )}
    </View>
  </View>
);

const Payment = () => {
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

  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalAmount = useSelector((state) => state.cart.totalAmount) || 0;

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // Constants to match screenshot exactly
  const primaryColor = colors.primary || '#d35400';
  const bgColor = dark ? '#121212' : '#fcfcfc';
  const containerBg = dark ? '#1e1e1e' : '#f0f0f0';

  const taxCost = totalAmount * 0.05; // 5% tax example
  const finalTotal = totalAmount + taxCost; // standard shipping is FREE in this design!

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>{t('OrderPaymentTitle')}</Text>
        <View style={styles.headerRight}>
          <MaterialCommunityIcons name="lock" size={16} color={colors.headerText} />
          <Text style={[styles.headerSecureText, { color: '#ccc' }]}>{t('Encrypted', '256-BIT AES')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Steps Indicator */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, { backgroundColor: '#e6f0ff' }]}>
              <Text style={[styles.stepNumber, { color: '#0066cc' }]}>01</Text>
            </View>
            <Text style={styles.stepTextGray}>{t('DeliveryStep')}</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, { backgroundColor: primaryColor }]}>
              <Text style={[styles.stepNumber, { color: '#fff' }]}>02</Text>
            </View>
            <Text style={[styles.stepTextBlack, { color: colors.text }]}>{t('PayMoneyStep')}</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, { backgroundColor: '#e0e0e0' }]}>
              <Text style={[styles.stepNumber, { color: '#888' }]}>03</Text>
            </View>
            <Text style={styles.stepTextGray}>{t('CheckStep')}</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: primaryColor }]}>{t('ChoosePay')}</Text>
          <Text style={[styles.subTitle, { color: dark ? '#aaa' : '#666' }]}>
            {t('SecureTransactions')}
          </Text>
        </View>

        {/* Payment Gateways */}
        <View style={styles.gatewaysContainer}>
          <TouchableOpacity style={[styles.gatewayBtn, { backgroundColor: '#002C8A' }]}>
            <View style={styles.whiteBlockIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gatewayBtn, { backgroundColor: dark ? '#222' : '#fff', borderWidth: 1, borderColor: '#eee' }]}>
            <MaterialCommunityIcons name="credit-card-outline" size={28} color="#4b84ff" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('PayATM')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <InputField 
            label={t('NameOnCard')} 
            placeholder={t('WriteYourName')} 
            value={cardName} onChangeText={setCardName} 
            dark={dark} colors={colors} 
          />
          <InputField 
            label={t('CardNumber')} 
            placeholder={t('CardFormat', '0000 0000 0000 0000')} 
            value={cardNumber} onChangeText={setCardNumber} 
            keyboardType="number-pad"
            icon="credit-card"
            dark={dark} colors={colors} 
          />
          
          <View style={styles.rowInputs}>
            <InputField 
              label={t('ExpireDate')} 
              placeholder={t('MonthYear')} 
              value={expiryDate} onChangeText={setExpiryDate} 
              style={{ flex: 1, marginRight: 10 }}
              dark={dark} colors={colors} 
            />
            <InputField 
              label={t('CVV')} 
              placeholder={t('CodeOnBack')} 
              value={cvv} onChangeText={setCvv} 
              keyboardType="number-pad"
              icon="help-circle"
              style={{ flex: 1, marginLeft: 10 }}
              dark={dark} colors={colors} 
            />
          </View>

          {/* Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setSaveCard(!saveCard)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={saveCard ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={saveCard ? primaryColor : (dark ? '#777' : '#999')} 
            />
            <Text style={[styles.checkboxText, { color: dark ? '#ccc' : '#555' }]}>
              {t('SaveCard')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={[styles.summaryContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>{t('BillSummary')}</Text>
            <View style={[styles.badge, { backgroundColor: colors.inputBg }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>{cartItems.length} {t('Items', 'ITEMS')}</Text>
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
              </View>
              <Text style={[styles.itemPrice, { color: colors.text }]}>Rs. {item.priceValue?.toLocaleString() || '0'}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalsRow}>
            <Text style={[styles.totalsLabel, { color: '#666' }]}>{t('SUBTOTAL')}</Text>
            <Text style={[styles.totalsValue, { color: colors.text }]}>Rs. {totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={[styles.totalsLabel, { color: '#666' }]}>{t('DeliveryStep')}</Text>
            <Text style={[styles.totalsValue, { color: primaryColor }]}>{t('Free')}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={[styles.totalsLabel, { color: '#666' }]}>{t('GovtTax')}</Text>
            <Text style={[styles.totalsValue, { color: colors.text }]}>Rs. {taxCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>

          <View style={[styles.totalsRow, { marginTop: 25, alignItems: 'flex-end' }]}>
            <Text style={[styles.totalDueLabel, { color: '#888' }]}>{t('TotalAmount')}</Text>
            <Text style={[styles.totalDueValue, { color: colors.text }]}>
              Rs. {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Checkout Action Box */}
          <View style={styles.actionBox}>
            <TouchableOpacity 
              style={[styles.continueBtn, { backgroundColor: primaryColor }]}
              onPress={() => navigation.navigate('OrderReview')}
            >
              <Text style={styles.continueBtnText}>{t('FinishOrder')}</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
            
            <View style={styles.secureActionTextRow}>
               <MaterialCommunityIcons name="shield-check" size={12} color="#aaa" />
               <Text style={styles.secureActionText}>{t('SecureTransaction')}</Text>
            </View>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustBadgeItem}>
            <MaterialCommunityIcons name="shield-lock" size={28} color="#aaa" />
            <Text style={styles.trustBadgeText}>{t('TrustBadges')}</Text>
          </View>
          <View style={styles.trustBadgeItem}>
            <MaterialCommunityIcons name="medal" size={28} color="#aaa" />
            <Text style={styles.trustBadgeText}>{t('TrustBadges2')}</Text>
          </View>
          <View style={styles.trustBadgeItem}>
            <MaterialCommunityIcons name="check-decagram" size={28} color="#aaa" />
            <Text style={styles.trustBadgeText}>{t('TrustBadges3')}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.footerLogo, { color: primaryColor }]}>{t('WafaHardware')}</Text>
          <Text style={styles.footerTagline}>
            {t('PaymentFooter')}
          </Text>
          
          <View style={styles.footerBottomRow}>
            <View style={styles.footerCol}>
              <Text style={styles.footerSupportLabel}>{t('CustomerSupport')}</Text>
              <Text style={[styles.footerSupportPhone, { color: colors.text }]}>1-800-WAFA-PRO</Text>
            </View>
            <View style={styles.footerColRight}>
              <MaterialCommunityIcons name="web" size={18} color="#666" />
              <Text style={[styles.footerLangText, { color: colors.text }]}>{t('Locale')}</Text>
            </View>
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSecureText: {
    fontSize: 9,
    color: '#888',
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepNumber: {
    fontWeight: '900',
    fontSize: 10,
  },
  stepTextGray: {
    fontSize: 10,
    color: '#888',
    fontWeight: '800',
    letterSpacing: 1,
  },
  stepTextBlack: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  gatewaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  gatewayBtn: {
    flex: 1,
    height: 55,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  whiteBlockIcon: {
    width: 28,
    height: 18,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 10,
    color: '#999',
    fontWeight: '800',
    letterSpacing: 1,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    height: '100%',
  },
  inputIcon: {
    marginLeft: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 35,
    paddingRight: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 16,
  },
  summaryContainer: {
    padding: 25,
    marginHorizontal: 20,
    borderRadius: 8,
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
    borderRadius: 10,
  },
  badgeText: {
    color: '#0066cc',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
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
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  itemSku: {
    fontSize: 10,
    color: '#888',
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
    marginBottom: 12,
    alignItems: 'center',
  },
  totalsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalsValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  totalDueLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalDueValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  actionBox: {
    backgroundColor: '#262626',
    borderRadius: 6,
    marginTop: 25,
    padding: 20,
  },
  continueBtn: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secureActionTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureActionText: {
    color: '#aaa',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 6,
  },
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 30,
  },
  trustBadgeItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustBadgeText: {
    marginTop: 10,
    fontSize: 8,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 0.5,
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
  },
  footerTagline: {
    fontSize: 10,
    color: '#666',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  footerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  footerCol: {
    flex: 1,
  },
  footerSupportLabel: {
    fontSize: 8,
    color: '#999',
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  footerSupportPhone: {
    fontSize: 13,
    fontWeight: '900',
  },
  footerColRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLangText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
  },
});

export default Payment;
