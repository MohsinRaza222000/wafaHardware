import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { clearUser } from '../store/authActions';
import { clearUserProfile, updateUserProfile } from '../store/userActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNav from '../components/BottomNav';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.user.profile);
  const user = userProfile || authUser;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editName, setEditName] = useState(user?.fullName || user?.displayName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editPhoto, setEditPhoto] = useState(user?.photoURL || '');

  const handleEdit = () => {
    // Reset fields to current values on each edit open
    setEditName(user?.fullName || user?.displayName || '');
    setEditPhone(user?.phone || '');
    setEditAddress(user?.address || '');
    setEditPhoto(user?.photoURL || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handlePickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.6, includeBase64: true },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (asset?.base64) {
          setEditPhoto(`data:image/jpeg;base64,${asset.base64}`);
        } else if (asset?.uri) {
          setEditPhoto(asset.uri);
        }
      }
    );
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }

    setSaving(true);
    const result = await dispatch(
      updateUserProfile({
        uid: user?.uid,
        email: user?.email,
        fullName: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
        photoURL: editPhoto,
      })
    );
    setSaving(false);

    if (result?.success) {
      setIsEditing(false);
      Alert.alert('Saved!', 'Your profile has been updated.');
    } else {
      Alert.alert('Error', result?.message || 'Could not save. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      dispatch(clearUser());
      dispatch(clearUserProfile());
      navigation.replace('Login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const avatarUri = isEditing ? editPhoto : user?.photoURL;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.topHeader, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={28} color={colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.brandText, { color: colors.headerText }]}>{t('WafaHardware')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <MaterialCommunityIcons name="cart-outline" size={26} color={colors.headerText} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Avatar ─── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : { uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.fullName || 'User') + '&background=a04000&color=fff&size=200' }
              }
              style={styles.avatar}
              onError={() => {}}
            />
            {isEditing && (
              <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
                <MaterialCommunityIcons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {!isEditing && (
            <Text style={[styles.displayName, { color: colors.text }]}>
              {user?.fullName || user?.displayName || 'Customer'}
            </Text>
          )}
          {!isEditing && (
            <Text style={[styles.displayEmail, { color: colors.textSecondary }]}>
              {user?.email || ''}
            </Text>
          )}
        </View>

        {/* ─── Detail Card ─── */}
        <View style={[styles.card, { backgroundColor: dark ? '#1e1e1e' : '#fff', borderColor: colors.border }]}>

          {/* Name */}
          <View style={styles.fieldBlock}>
            <View style={styles.fieldLabelRow}>
              <MaterialCommunityIcons name="account-outline" size={16} color={colors.primary} />
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('Name')}</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: dark ? '#2a2a2a' : '#f9f9f9' }]}
                value={editName}
                onChangeText={setEditName}
                placeholder={t('WriteYourName')}
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>
                {user?.fullName || user?.displayName || '—'}
              </Text>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Email (read-only always) */}
          <View style={styles.fieldBlock}>
            <View style={styles.fieldLabelRow}>
              <MaterialCommunityIcons name="email-outline" size={16} color={colors.primary} />
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('EmailAddress')}</Text>
            </View>
            <Text style={[styles.fieldValue, { color: colors.text }]}>
              {user?.email || '—'}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Phone */}
          <View style={styles.fieldBlock}>
            <View style={styles.fieldLabelRow}>
              <MaterialCommunityIcons name="phone-outline" size={16} color={colors.primary} />
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('PhoneNumber')}</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: dark ? '#2a2a2a' : '#f9f9f9' }]}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder={t('PhoneNumber')}
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>
                {user?.phone || '—'}
              </Text>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Address */}
          <View style={styles.fieldBlock}>
            <View style={styles.fieldLabelRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.primary} />
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('Address')}</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.inputMultiline, { color: colors.text, borderColor: colors.border, backgroundColor: dark ? '#2a2a2a' : '#f9f9f9' }]}
                value={editAddress}
                onChangeText={setEditAddress}
                placeholder={t('AddressDesc')}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>
                {user?.address || '—'}
              </Text>
            )}
          </View>
        </View>

        {/* ─── Action Buttons ─── */}
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }, saving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="content-save-outline" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>{t('SAVECHANGES').replace('\n', ' ')}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>{t('CANCEL')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: colors.primary }]}
            onPress={handleEdit}
          >
            <MaterialCommunityIcons name="pencil-outline" size={18} color="#fff" />
            <Text style={styles.editBtnText}>{t('EDIT')}</Text>
          </TouchableOpacity>
        )}

        {/* ─── Log Out ─── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color="#e74c3c" />
          <Text style={styles.logoutText}>{t('SIGNOUT')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 15,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 110,
    paddingHorizontal: 20,
  },

  /* Avatar */
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#ddd',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#a04000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  displayEmail: {
    fontSize: 13,
    fontWeight: '500',
  },

  /* Card */
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  fieldBlock: {
    paddingVertical: 16,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  divider: {
    height: 1,
  },

  /* Inputs */
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /* Buttons */
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 6,
  },
  editActions: {
    marginBottom: 16,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 10,
    marginBottom: 10,
    gap: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 6,
  },
  cancelBtn: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 6,
  },
});

export default ProfileScreen;
