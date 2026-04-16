import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { WebView } from 'react-native-webview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);

  const SHOP_LAT = 32.28352;
  const SHOP_LON = 72.43780;
  const SHOP_NAME = "Wafa Hardware and glass centre shahpur City";

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${SHOP_LAT},${SHOP_LON}`;
    Linking.openURL(url);
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wafa Hardware Locator</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .custom-pin {
          background-color: #a04000;
          border: 2px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${SHOP_LAT}, ${SHOP_LON}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var shopMarker = L.marker([${SHOP_LAT}, ${SHOP_LON}]).addTo(map)
          .bindPopup('<b>Wafa Hardware and glass centre</b><br>Shahpur City, Sargodha')
          .openPopup();

        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var userLat = position.coords.latitude;
            var userLon = position.coords.longitude;
            
            L.marker([userLat, userLon]).addTo(map)
              .bindPopup('<b>You are here</b>');
              
            // Send back to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'location',
              lat: userLat,
              lon: userLon
            }));
          });
        }
      </script>
    </body>
    </html>
  `;

  const onMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'location') {
      const dist = calculateDistance(data.lat, data.lon, SHOP_LAT, SHOP_LON);
      setDistance(dist);
    }
  };

  return (
    <ScreenContainer>
      <Header />
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.subtitle, { color: colors.primary }]}>SHOP LOCATION</Text>
          <Text style={[styles.title, { color: colors.text }]}>Wafa Hardware Store</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
         <WebView
           source={{ html: mapHtml }}
           style={styles.webview}
           onMessage={onMessage}
           onLoadEnd={() => setLoading(false)}
           geolocationEnabled={true}
         />
         
         {loading && (
           <View style={styles.loader}>
             <ActivityIndicator size="large" color={colors.primary} />
           </View>
         )}

         <View style={[styles.infoCard, { backgroundColor: dark ? '#1a1a1a' : '#fff' }]}>
            <Text style={[styles.cardTitle, { color: dark ? '#fff' : '#333' }]}>TRAVEL INFO</Text>
            
            <View style={styles.statsRow}>
               <View style={styles.statItem}>
                  <Text style={styles.statLabel}>DISTANCE</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {distance ? `${distance} KM` : 'CALCULATING...'}
                  </Text>
               </View>
               <View style={styles.vDivider} />
               <View style={styles.statItem}>
                  <Text style={styles.statLabel}>EST. TRAVEL</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {distance ? `${Math.ceil(distance * 3)} MIN` : '--'}
                  </Text>
               </View>
            </View>

            <TouchableOpacity 
              style={[styles.directionsBtn, { backgroundColor: colors.primary }]}
              onPress={openInGoogleMaps}
            >
               <MaterialCommunityIcons name="google-maps" size={20} color="#fff" />
               <Text style={styles.directionsText}>OPEN IN GOOGLE MAPS</Text>
            </TouchableOpacity>
         </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backBtn: {
    marginRight: 15,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 15,
    letterSpacing: 1,
    color: '#888',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    color: '#999',
    fontWeight: '900',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  vDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
  },
  directionsBtn: {
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  directionsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default MapScreen;
