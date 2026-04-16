import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { clearUser } from '../store/authActions';
import { clearUserProfile } from '../store/userActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../services/notificationService';


const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, dark, toggleTheme } = useTheme();
  const authUser = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.user.profile);
  
  // Use profile data if available, fallback to firebase auth data
  const user = userProfile || authUser;

  // Settings States
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  React.useEffect(() => {
    const syncNotificationStatus = async () => {
      const pref = await notificationService.getLocalPreference();
      const status = await notificationService.checkPermissionStatus();
      setNotificationsEnabled(pref && status === 'granted');
    };
    syncNotificationStatus();
  }, []);

  
  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    setLangModalVisible(false);
  };
  
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');

  const handleSignOut = () => {
    Alert.alert(
      t('Logout'),
      t('LogoutConfirm'),
      [
        { text: t('Cancel'), style: 'cancel' },
        { 
          text: t('SIGNOUT'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut();
              dispatch(clearUser());
              dispatch(clearUserProfile());
            } catch (error) {
              Alert.alert(t('Logout'), error.message);
            }
          }
        },
      ]
    );
  };

  const handleChangePassword = () => {
    // Reset states and open modal
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setPassError('');
    setPasswordModalVisible(true);
  };

  const handlePasswordUpdate = async () => {
    // Basic Validations
    if (!currentPass || !newPass || !confirmPass) {
      setPassError('Please fill all password fields.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match!');
      return;
    }

    setPassLoading(true);
    setPassError('');

    try {
      const currentUser = auth().currentUser;
      if (!currentUser || !currentUser.email) {
        setPassError('No user session found. Please log in again.');
        return;
      }

      // 1. Re-authenticate
      const credential = auth.EmailAuthProvider.credential(
        currentUser.email,
        currentPass
      );
      await currentUser.reauthenticateWithCredential(credential);

      // 2. Update Password
      await currentUser.updatePassword(newPass);

      setPassLoading(false);
      setPasswordModalVisible(false);
      Alert.alert('Success', 'Your password has been changed successfully.');
    } catch (error) {
      setPassLoading(false);
      console.log('Password update error:', error);
      
      let message = 'Could not update password.';
      if (error.code === 'auth/wrong-password') {
        message = 'Current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        message = 'New password is too weak.';
      } else if (error.code === 'auth/requires-recent-login') {
        message = 'Security sensitive. Please logout and login again.';
      }
      setPassError(message);
    }
  };

  const handleToggleNotifications = async (value) => {
    if (value) {
      // Trying to enable
      const status = await notificationService.checkPermissionStatus();
      
      if (status === 'granted') {
        await notificationService.setLocalPreference(true);
        await notificationService.syncTopicSubscription(true);
        setNotificationsEnabled(true);
      } else if (status === 'denied') {
        const granted = await notificationService.requestPermission();
        setNotificationsEnabled(granted);
      } else {
        // Blocked
        Alert.alert(
          t('NotificationsBlocked'),
          t('OpenSettingsToEnable'),
          [
            { text: t('Cancel'), style: 'cancel' },
            { text: t('SETTINGS'), onPress: () => notificationService.openSettings() }
          ]
        );
      }
    } else {
      // Disabling on this device
      Alert.alert(
        t('DisableAlerts'),
        t('DisableAlertsDesc'),
        [
          { text: t('Cancel'), style: 'cancel' },
          { 
            text: t('TURNOFF'), 
            style: 'destructive',
            onPress: async () => {
              await notificationService.setLocalPreference(false);
              await notificationService.syncTopicSubscription(false);
              setNotificationsEnabled(false);
              // Inform specifically about system settings for total block
              Alert.alert(t('DeviceAlertsOff'), t('TotalBlockNote'));
            }
          }
        ]
      );
    }
  };

  const SettingItem = ({ icon, title, subtitle, onPress, isToggle, value, onToggle }) => (

    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.surface }]} 
      onPress={onPress}
      disabled={isToggle}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.text} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {isToggle ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#d35400' }}
          thumbColor="#fff"
        />
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.headerLine} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.headerText }]}>{t('SETTINGS')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: '#1a2b48',marginTop:20 }]}>
          <Image 
            source={{ uri: user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=a04000&color=fff&size=150` }} 
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.fullName || user?.displayName || 'Customer'}</Text>
            <Text style={styles.userRole}>{t('ValuedShopper')}</Text>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="shield-check" size={12} color="#fff" />
              <Text style={styles.badgeText}>{t('RegularCustomer')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="cog-outline" size={100} color="rgba(255,255,255,0.05)" style={styles.bgGear} />
        </View>

        {/* ACCOUNT SECTION */}
        <SectionHeader title={t('ACCOUNT')} />
        <SettingItem 
          icon="account-outline" 
          title={t('Profile')} 
          subtitle={t('PersonalInfo')}
          onPress={() => navigation.navigate('Profile')}
        />
        <SettingItem 
          icon="credit-card-outline" 
          title={t('PaymentMethods')} 
          subtitle={t('PaymentSub')}
          onPress={() => navigation.navigate('Payment')}
        />
        <SettingItem 
          icon="lock-outline" 
          title={t('ChangePassword')} 
          subtitle={t('PasswordSub')}
          onPress={handleChangePassword}
        />

        {/* APP SETTINGS SECTION */}
        <SectionHeader title={t('APP SETTINGS')} />
        <SettingItem 
          icon="bell-outline" 
          title={t('NotificationPreferences')} 
          subtitle={notificationsEnabled ? t('Enabled') : t('Disabled')}
          isToggle={true}
          value={notificationsEnabled}
          onToggle={handleToggleNotifications}
        />

        <SettingItem 
          icon="earth" 
          title={t('Language')} 
          subtitle={i18n.language === 'ur' ? 'اردو' : 'English'}
          onPress={() => setLangModalVisible(true)}
        />
        <SettingItem 
          icon="weather-night" 
          title={t('DarkMode')} 
          subtitle={dark ? t('On') : t('Off')}
          isToggle={true}
          value={dark}
          onToggle={toggleTheme}
        />

        {/* SUPPORT SECTION */}
        <SectionHeader title={t('SUPPORT')} />
        <SettingItem 
          icon="help-circle-outline" 
          title={t('HelpCenter')} 
          onPress={() => navigation.navigate('Contact')}
        />
        <SettingItem 
          icon="file-document-outline" 
          title={t('TermsOfService')} 
          onPress={() => navigation.navigate('TermsOfService')}
        />
        <SettingItem 
          icon="shield-lock-outline" 
          title={t('PrivacyPolicy')} 
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t('SIGNOUT')}</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>WAFA HARDWARE</Text>
          <Text style={styles.footerVersion}>VERSION 2.4.1 - OFFICIAL APP</Text>
        </View>

      </ScrollView>
      
      {/* Language Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={langModalVisible}
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.langModalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.langModalTitle, { color: colors.text }]}>{t('SelectLanguage')}</Text>
            
            <TouchableOpacity 
              style={[styles.langOption, i18n.language === 'en' && { borderColor: '#d35400', backgroundColor: 'rgba(211,84,0,0.05)' }]} 
              onPress={() => changeLanguage('en')}
            >
              <Text style={[styles.langText, { color: colors.text }]}>🇺🇸 {t('English')}</Text>
              {i18n.language === 'en' && <MaterialCommunityIcons name="check-circle" size={24} color="#d35400" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langOption, i18n.language === 'ur' && { borderColor: '#d35400', backgroundColor: 'rgba(211,84,0,0.05)' }]} 
              onPress={() => changeLanguage('ur')}
            >
              <Text style={[styles.langText, { color: colors.text }]}>🇵🇰 {t('Urdu')}</Text>
              {i18n.language === 'ur' && <MaterialCommunityIcons name="check-circle" size={24} color="#d35400" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.langCancelBtn} 
              onPress={() => setLangModalVisible(false)}
            >
              <Text style={[styles.langCancelText, { color: colors.textSecondary }]}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('SecurityUpdate')}</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              {t('PasswordModalDesc')}
            </Text>

            {passError ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle" size={16} color="#e74c3c" />
                <Text style={styles.errorText}>{passError}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('CurrentPassword')}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: dark ? '#2c2c2c' : '#f5f5f5', color: colors.text, borderColor: colors.border }]}
                placeholder={t('EnterCurrentPass')}
                placeholderTextColor="#888"
                secureTextEntry
                value={currentPass}
                onChangeText={setCurrentPass}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('NewPassword')}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: dark ? '#2c2c2c' : '#f5f5f5', color: colors.text, borderColor: colors.border }]}
                placeholder={t('AtLeast6Chars')}
                placeholderTextColor="#888"
                secureTextEntry
                value={newPass}
                onChangeText={setNewPass}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('ConfirmNewPassword')}</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: dark ? '#2c2c2c' : '#f5f5f5', color: colors.text, borderColor: colors.border }]}
                placeholder={t('RepeatNewPass')}
                placeholderTextColor="#888"
                secureTextEntry
                value={confirmPass}
                onChangeText={setConfirmPass}
              />
            </View>

            <TouchableOpacity 
              style={[styles.updateBtn, { opacity: passLoading ? 0.7 : 1 }]} 
              onPress={handlePasswordUpdate}
              disabled={passLoading}
            >
              {passLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.updateBtnText}>{t('SecureUpdatePass')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelBtn} 
              onPress={() => setPasswordModalVisible(false)}
              disabled={passLoading}
            >
              <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>{t('CANCEL')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    marginBottom: 30,
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d35400',
  },
  profileInfo: {
    marginLeft: 18,
    zIndex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  userRole: {
    color: '#a0acbd',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 5,
  },
  bgGear: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  headerLine: {
    width: 25,
    height: 3,
    backgroundColor: '#a04000',
    marginRight: 10,
  },
  sectionHeaderText: {
    color: '#a04000',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textContainer: {
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    fontWeight: '600',
  },
  signOutBtn: {
    backgroundColor: '#d35400',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#d35400',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerBrand: {
    color: '#888',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerVersion: {
    color: '#bbb',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 5,
    letterSpacing: 0.5,
  },
  
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
    marginLeft: 4,
  },
  modalInput: {
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    borderWidth: 1,
  },
  updateBtn: {
    backgroundColor: '#d35400',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    elevation: 4,
    shadowColor: '#d35400',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  updateBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  modalCancelBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  langModalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 25,
    alignSelf: 'center',
    marginBottom: '50%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  langModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  langText: {
    fontSize: 16,
    fontWeight: '700',
  },
  langCancelBtn: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
  langCancelText: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default SettingsScreen;
