import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { hideToast } from '../store/uiActions';

const { width } = Dimensions.get('window');

const GlobalToast = () => {
  const dispatch = useDispatch();
  const { visible, message, toastType } = useSelector((state) => state.ui.toast);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Slide Down
      Animated.spring(slideAnim, {
        toValue: Platform.OS === 'ios' ? 60 : 40,
        useNativeDriver: true,
        bounciness: 10,
      }).start();

      // Auto Hide
      const timer = setTimeout(() => {
        handleHide();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      handleHide();
    }
  }, [visible]);

  const handleHide = () => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (visible) dispatch(hideToast());
    });
  };

  if (!visible && slideAnim.__getValue() === -120) return null;

  const getToastStyles = () => {
    switch (toastType) {
      case 'error':
        return {
          bg: '#ba1a1a',
          icon: 'alert-circle',
        };
      case 'info':
        return {
          bg: '#0061a4',
          icon: 'information',
        };
      default: // success
        return {
          bg: '#F26B00',
          icon: 'check-circle',
        };
    }
  };

  const { bg, icon } = getToastStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: bg,
        },
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name={icon} size={24} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default GlobalToast;
