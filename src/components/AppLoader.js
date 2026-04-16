import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const AppLoader = () => {
  const { loading, message } = useSelector((state) => state.ui || { loading: false, message: '' });
  const { dark } = useTheme();
  
  const rotation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let anim;
    if (loading) {
      anim = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      anim.start();
    } else {
      rotation.setValue(0);
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [loading]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const animatedStyle = {
    transform: [{ rotate: spin }],
  };

  if (!loading) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.loaderContainer, { backgroundColor: dark ? '#1a1a1a' : '#fff' }]}>
          {/* Animated Gear */}
          <View style={styles.gearContainer}>
            <Animated.Image 
              source={require('../assets/images/gear_confirmation.png')} 
              style={[styles.gearIcon, animatedStyle]}
              resizeMode="contain"
            />
            <View style={styles.centerDot} />
          </View>

          <Text style={[styles.loadingText, { color: dark ? '#fff' : '#333' }]}>
            {message}
          </Text>
          
          <View style={styles.progressLineBG}>
             <View style={styles.progressLineActive} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)', // Darker for industrial focus
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: width * 0.8,
    paddingVertical: 45,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(242,107,0,0.2)',
    elevation: 20,
    shadowColor: '#F26B00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  gearContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  gearIcon: {
    width: '100%',
    height: '100%',
    tintColor: '#F26B00',
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#F26B00',
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.5,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  progressLineBG: {
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 25,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressLineActive: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F26B00',
    opacity: 0.5,
  },
});

export default AppLoader;
