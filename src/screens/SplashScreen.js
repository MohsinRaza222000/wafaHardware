import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const SplashScreen = ({ onVideoEnd }) => {

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/images/splash-1.mp4')} // Your splash video asset
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        repeat={false}         // Play only once
        muted={true}           // Muted so audio doesn't interfere
        allowsExternalPlayback={false}
        onEnd={onVideoEnd}     // Trigger navigation when finished
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background to avoid flash before video loads
  },
});

export default SplashScreen;
