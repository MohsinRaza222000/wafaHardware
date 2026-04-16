import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authActions';
import { setUserProfile } from '../store/userActions';
import { setLoading } from '../store/uiActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';

const { width } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleSignup = async () => {
    if (!fullName || !email || !password || !phone || !address) {
      Alert.alert('Details Missing', 'Please fill all boxes to create your account.');
      return;
    }

    dispatch(setLoading(true, 'JOINING...'));
    
    try {
      // 1. Firebase Authentication
      const result = await auth().createUserWithEmailAndPassword(email, password);
      const firebaseUser = result.user;
      
      // 2. Update Firebase Display Name
      await firebaseUser.updateProfile({ displayName: fullName });

      // 3. Prepare Image Data (Base64 as seen in MongoDB screenshot)
      const photoURL = photo ? `data:${photo.type};base64,${photo.base64}` : '';

      // 4. Sync with MongoDB
      const userData = {
        uid: firebaseUser.uid,
        fullName,
        email: email.toLowerCase(),
        phone,
        address,
        photoURL,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      try {
        await apiRequest(ENDPOINTS.USER_SYNC, {
          method: 'POST',
          body: JSON.stringify(userData),
        });
      } catch (syncError) {
        console.warn('MongoDB Sync Failed (Data remains on Firebase):', syncError.message);
        // We don't stop the flow here if sync fails, but we log it.
      }

      // 5. Update Redux state (Auth & User Profile slices)
      dispatch(setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: fullName,
      }));
      
      dispatch(setUserProfile(userData));

      Alert.alert('Welcome!', 'Your account is ready.');
      navigation.replace('Main');

    } catch (error) {
      console.error(error);
      let msg = 'Something went wrong. Try again.';
      if (error.code === 'auth/email-already-in-use') msg = 'That email is already registered.';
      if (error.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
      if (error.code === 'auth/weak-password') msg = 'Password is too weak.';
      
      Alert.alert('Signup Failed', msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Registration Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>JOIN{"\n"}US</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>CREATE YOUR SHOPPING ACCOUNT</Text>
        </View>

        {/* Profile Image Picker */}
        <View style={styles.photoSection}>
          <TouchableOpacity 
            style={[styles.photoCircle, { borderColor: colors.primary, backgroundColor: colors.surface }]} 
            onPress={handleSelectImage}
          >
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialCommunityIcons name="camera-plus-outline" size={32} color={colors.textSecondary} />
                <Text style={[styles.photoLink, { color: colors.textSecondary }]}>ADD PHOTO</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Signup Form */}
        <View style={styles.form}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>YOUR NAME</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }]}>
            <MaterialCommunityIcons name="account-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Write your name (e.g. Ali Raza)"
              placeholderTextColor={colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>EMAIL ADDRESS</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }]}>
            <MaterialCommunityIcons name="email-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="name@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>PHONE NUMBER</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }]}>
                <MaterialCommunityIcons name="phone-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="03xx-xxxxxxx"
                  placeholderTextColor={colors.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>APP PASSWORD</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }]}>
                <MaterialCommunityIcons name="lock-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="********"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>YOUR ADDRESS (HOME OR SHOP)</Text>
          <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start', paddingTop: 15, backgroundColor: colors.inputBg }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.textSecondary} style={{ marginTop: 2, marginRight: 10 }} />
            <TextInput
              style={[styles.input, { height: 70, color: colors.text }]}
              placeholder="Write your home or shop address"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity
            style={[styles.signupBtn, { backgroundColor: colors.primary }]}
            onPress={handleSignup}
          >
            <Text style={styles.signupBtnText}>JOIN NOW</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>Already have an account? <Text style={{ color: colors.primary }}>LOGIN</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    marginBottom: 30,
  },
  backBtn: {
    marginBottom: 20,
    marginLeft: -5,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1b1c1c',
    lineHeight: 40,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '900',
    color: '#a04100',
    letterSpacing: 2,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoLink: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8e7164',
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1b1c1c',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0eded',
    borderRadius: 4,
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1b1c1c',
    fontWeight: '600',
  },
  signupBtn: {
    height: 64,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  signupBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  loginLinkText: {
    color: '#8e7164',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

export default SignupScreen;
