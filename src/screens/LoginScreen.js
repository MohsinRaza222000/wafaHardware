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
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authActions';
import { fetchUserProfile } from '../store/userActions';
import { setLoading, showToast } from '../store/uiActions';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all boxes');
      return;
    }

    const isAdminEmail = email.toLowerCase() === 'wafahardware@gmail.com';

    // STRICT VALIDATION: Check for mode and email mismatch BEFORE proceeding
    if (isAdminEmail && !isAdminMode) {
      Alert.alert('Selection Error', 'Please select the Shop Owner button.');
      return;
    }

    if (!isAdminEmail && isAdminMode) {
      Alert.alert('Access Denied', 'You are not authorized as a Shop Owner.');
      return;
    }

    dispatch(setLoading(true, 'WAIT A MOMENT...'));
    
    try {
      // Live Firebase Authentication
      const result = await auth().signInWithEmailAndPassword(email, password);
      const user = result.user;

      // Update Redux state with chosen mode
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'User',
        isAdminMode: isAdminMode, // Store the intended role
      }));

      // Explicitly fetch detailed profile from MongoDB
      dispatch(fetchUserProfile(user.uid));

      dispatch(showToast(isAdminMode ? 'Admin login successful' : 'Login successful', 'success'));

      
      // Navigate to correct screen based on confirmed mode
      if (isAdminMode) {
        navigation.replace('AdminMain');
      } else {
        navigation.replace('Main');
      }

    } catch (error) {
      console.error(error);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
      if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.mainContent}>
        {/* Header Branding */}
        <View style={styles.brandingHeader}>
          <MaterialCommunityIcons name="security" size={28} color={colors.primary} />
          <Text style={[styles.brandText, { color: colors.text }]}>WAFA HARDWARE</Text>
        </View>

        {/* Login Toggle */}
        <View style={[styles.toggleContainer, { backgroundColor: colors.inputBg }]}>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isAdminMode && [styles.activeToggle, { backgroundColor: colors.surface }]]} 
            onPress={() => setIsAdminMode(false)}
          >
            <Text style={[styles.toggleText, { color: colors.textSecondary }, !isAdminMode && { color: colors.primary }]}>Customer Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, isAdminMode && [styles.activeToggle, { backgroundColor: colors.surface }]]} 
            onPress={() => setIsAdminMode(true)}
          >
            <Text style={[styles.toggleText, { color: colors.textSecondary }, isAdminMode && { color: colors.primary }]}>Shop Owner</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>EMAIL</Text>
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

          <View style={styles.passwordHeader}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>PASSWORD</Text>
            <TouchableOpacity><Text style={[styles.forgotBtn, { color: colors.primary }]}>FORGOT PASSWORD?</Text></TouchableOpacity>
          </View>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }]}>
            <MaterialCommunityIcons name="lock-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="........"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.loginBtnText}>LOGIN</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
          </TouchableOpacity>

          {!isAdminMode && (
            <TouchableOpacity 
              style={[styles.signupBtn, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={[styles.signupBtnText, { color: colors.primary }]}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1b1c1c',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  welcomeSection: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1b1c1c',
    marginBottom: 8,
    letterSpacing: -1,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#8e7164',
    lineHeight: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0eded',
    borderRadius: 8,
    padding: 4,
    marginBottom: 35,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#8e7164',
  },
  activeToggleText: {
    color: '#a04100',
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1b1c1c',
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0eded',
    borderRadius: 4,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 25,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1b1c1c',
    fontWeight: '600',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotBtn: {
    fontSize: 10,
    fontWeight: '900',
    color: '#a04100',
    letterSpacing: 1,
    marginBottom: 10,
  },
  loginBtn: {
    backgroundColor: '#fb6a00',
    height: 64,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  signupBtn: {
    height: 60,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupBtnText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default LoginScreen;
