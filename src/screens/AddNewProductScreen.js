import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenContainer from '../components/ScreenContainer';
import { apiRequest } from '../services/apiService';
import { ENDPOINTS } from '../config/api';
import { showToast } from '../store/uiActions';

import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';

const AddNewProductScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { colors, dark } = useTheme();

  const scrollRef = useRef(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Hardboard');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');

  const [image, setImage] = useState('https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  const [selectedImage, setSelectedImage] = useState(null);

  // Management State
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Category Dropdown State
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const categoriesList = ['Door Skins', 'Tools', 'Cabinet Sheets', 'Glass', 'Paints', 'Accessories', 'Hardboard'];

  useEffect(() => {
    if (route.params?.product) {
      const p = route.params.product;
      setName(p.title);
      setPrice(String(p.price));
      setCategory(p.category);
      setSku(p.sku || '');
      setDescription(p.description || '');
      setStock(String(p.stock || '0'));
      setImage(p.image);
      setIsEditing(true);
      setEditingId(p._id);
    }
  }, [route.params?.product]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('Hardboard');
    setSku('');
    setDescription('');
    setStock('');

    setImage('https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
    setSelectedImage(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setImage(asset.uri);
        setSelectedImage(asset);
      }
    });
  };

  const handlePublish = async () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Essential fields are missing.');
      return;
    }

    const productData = {
      title: name.trim(),
      price: parseFloat(price),
      category: category.trim(),
      description: (description || '').trim(),
      stock: parseInt(stock || '0'),
      sku: (sku || '').trim(),
      image: selectedImage?.base64 
        ? `data:${selectedImage.type};base64,${selectedImage.base64}` 
        : image,
    };

    try {
      setLoading(true);
      let response;
      if (isEditing) {
        response = await apiRequest(`${ENDPOINTS.PRODUCTS}/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
      } else {
        response = await apiRequest(ENDPOINTS.PRODUCTS, {
          method: 'POST',
          body: JSON.stringify(productData),
        });
      }

      if (response.success) {
        dispatch(showToast(isEditing ? 'Product updated successfully' : 'New product added successfully', 'success'));
        navigation.goBack(); // Return to inventory list
      }

    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to sync with MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <SafeAreaView style={styles.headerWrapper}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
            <Text style={styles.headerTitle}>{isEditing ? t('EDITPRODUCT') : t('ADDPRODUCT')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
             <ActivityIndicator size="large" color="#F26B00" />
          </View>
        )}

        {/* Breadcrumbs & Titles */}
        <View style={styles.breadCrumbRow}>
          <Text style={styles.breadCrumbInactive}>{t('INVENTORY')}</Text>
          <MaterialCommunityIcons name="chevron-right" size={14} color="#ccc" />
          <Text style={styles.breadCrumbActive}>{isEditing ? t('UPDATITEM') : t('ADDNEWITEM')}</Text>
        </View>

        <Text style={styles.pageTitle}>{isEditing ? t('UPDATITEM').replace(' ', '\n') : t('ADDNEWITEM').replace(' ', '\n')}</Text>
        <Text style={styles.pageSubtitle}>
          {isEditing 
            ? t('EditSub') || "Change the details for this item in your shop."
            : t('AddSub') || "Enter the details for your new product to show it in the shop."
          }
        </Text>

        {/* Visual Asset Section */}
        <View style={styles.assetSection}>
          <View style={styles.assetHeader}>
             <View style={styles.orangeDot} />
             <Text style={styles.assetHeaderText}>{t('ITEMPHOTO')}</Text>
          </View>
          
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
             <View style={styles.dashOutline}>
                {image ? (
                  <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="camera-outline" size={32} color="#888" />
                    <Text style={styles.uploadTitle}>{t('UPLOADPHOTO')}</Text>
                  </>
                )}
             </View>
          </TouchableOpacity>

          <View style={styles.assetStatusRow}>
              <View style={styles.statusLabelContainer}>
                 <MaterialCommunityIcons name="check-circle" size={16} color="#F26B00" />
                 <Text style={styles.statusText}>{isEditing ? t('PHOTOSAVED') : t('PHOTOREADY')}</Text>
              </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('PRODUCTNAME')}</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. Titan-X High Tensile Hardboard"
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
              />
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('SELECTCATEGORY')}</Text>
              <TouchableOpacity style={styles.dropdownBox} onPress={() => setShowCategoryPicker(true)}>
                 <Text style={styles.dropdownValue}>{t(category.replace(' ', '')) || category}</Text>
                 <MaterialCommunityIcons name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('ITEMCODE')}</Text>
              <TextInput 
                style={styles.input} 
                placeholder="WF-HB-99801"
                placeholderTextColor="#bbb"
                value={sku}
                onChangeText={setSku}
              />
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('ITEMDESCRIPTION')}</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Enter specifications..."
                placeholderTextColor="#bbb"
                multiline
                value={description}
                onChangeText={setDescription}
              />
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('UNITPRICE')}</Text>
              <View style={styles.inputWithIcon}>
                 <Text style={styles.inputPrefix}>Rs.</Text>
                 <TextInput 
                   style={styles.inputNoBorder} 
                   placeholder="0.00"
                   placeholderTextColor="#bbb"
                   keyboardType="numeric"
                   value={price}
                   onChangeText={setPrice}
                 />
              </View>
           </View>

           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('ITEMSSINSTOCK')}</Text>
              <View style={styles.inputWithIcon}>
                 <MaterialCommunityIcons name="package-variant-closed" size={18} color="#888" style={{ marginRight: 10 }} />
                 <TextInput 
                   style={styles.inputNoBorder} 
                   placeholder="0"
                   placeholderTextColor="#bbb"
                   keyboardType="numeric"
                   value={stock}
                   onChangeText={setStock}
                 />
              </View>
           </View>

           <View style={styles.actionRow}>
               <TouchableOpacity style={styles.discardBtn} onPress={() => navigation.goBack()}>
                  <Text style={styles.discardText}>{t('CANCEL')}</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
                  <Text style={styles.publishText}>{isEditing ? t('SAVECHANGES') : t('SAVEITEM')}</Text>
               </TouchableOpacity>
            </View>
        </View>
      </ScrollView>

      {/* Category Dropdown Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryPicker(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{t('SELECTCATEGORY')}</Text>
            {categoriesList.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={styles.modalItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryPicker(false);
                }}
              >
                <Text style={styles.modalItemText}>{t(cat.replace(' ', '')) || cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 100,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breadCrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  breadCrumbInactive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#bbb',
    letterSpacing: 1,
  },
  breadCrumbActive: {
    fontSize: 10,
    fontWeight: '900',
    color: '#F26B00',
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1a1a1a',
    lineHeight: 40,
    marginBottom: 20,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 40,
  },
  assetSection: {
    backgroundColor: '#fafafa',
    padding: 20,
    borderRadius: 4,
    marginBottom: 30,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  orangeDot: {
    width: 6,
    height: 6,
    backgroundColor: '#F26B00',
  },
  assetHeaderText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#333',
    letterSpacing: 2,
  },
  uploadBox: {
    height: 180,
    backgroundColor: '#f1f1f1',
    borderRadius: 2,
    overflow: 'hidden',
  },
  dashOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#333',
    marginTop: 15,
  },
  assetStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#efefef',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#F26B00',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#333',
  },
  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  formContainer: {
    marginBottom: 50,
  },
  fieldGroup: {
    marginBottom: 25,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#BC8F8F',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ececec',
    height: 50,
    paddingHorizontal: 20,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  inputNoBorder: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  inputWithIcon: {
    backgroundColor: '#ececec',
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputPrefix: {
    fontSize: 13,
    fontWeight: '900',
    color: '#888',
    marginRight: 10,
  },
  textArea: {
    height: 80,
    paddingTop: 15,
  },
  dropdownBox: {
    backgroundColor: '#ececec',
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  discardBtn: {
    padding: 15,
  },
  discardText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4E5D6C',
  },
  publishBtn: {
    backgroundColor: '#F26B00',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 2,
    elevation: 8,
  },
  publishText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 8,
    padding: 20,
  },
  modalHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F26B00',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
  },
});

export default AddNewProductScreen;
