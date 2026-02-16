import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// Import your API functions:
import { GetSubscription } from '../api/get/[...subscriptionApi]/subscription.api';
import { createSubscription } from '../api/post/[...subscriptionApi]/subscription.api';
import { DeleteSubscription } from '../api/delete/[...subscriptionApi]/subscription.api';
import { EditSubscription } from '../api/put/[...subscriptionApi]/subscription.api';

const STATUS_COLORS = {
  Active: { bg: 'rgba(16,185,129,0.1)', text: '#34d399' },      
  Inactive: { bg: 'rgba(253,224,71,0.1)', text: '#fde047' },    
  Paused: { bg: 'rgba(56,189,248,0.1)', text: '#38bdf8' },      
  Cancelled: { bg: 'rgba(251,113,133,0.1)', text: '#fb7185' },  
  Default: { bg: 'rgba(156,163,175,0.1)', text: '#9ca3af' },    // gray
};

const initialFormData = {
  subscriptionDetails: { appName: '', category: '', planType: '' },
  billingDetails: { amount: '', currency: 'USD', paymentMethod: '', autoRenew: false },
  datesDetails: { startDate: '', nextBillingDate: '' },
  remindaerDaysBefore: '',
  status: 'Active',
};

export const HomeScreen = () => {
  const navigate = useNavigation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await GetSubscription();
      setSubscriptions(data || []);
      setError('');
    } catch (err) {
      console.log('Error fetching subscriptions:', err);
      setError('Failed to load subscriptions');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('email');
      navigate.navigate('Landing');
    } catch (error) {
      console.log(`Error during logout: ${error}`);
    }
  };

  const handleInputChange = (section, key, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSimpleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddOrEdit = async () => {
    setError('');
    if (!formData.subscriptionDetails.appName || !formData.billingDetails.amount) {
      setError('App name and amount are required');
      return;
    }
    try {
      if (editingId) {
        // Edit
        const response = await EditSubscription(editingId, formData);
        if (!response || !response.data) throw new Error('Failed to update');
        setSubscriptions(subs =>
          subs.map(sub => (sub._id === editingId ? { ...formData, _id: editingId } : sub))
        );
      } else {
        // Add
        const response = await createSubscription(
          formData.subscriptionDetails.appName,
          formData.subscriptionDetails.category,
          formData.subscriptionDetails.planType,
          formData.billingDetails.amount,
          formData.billingDetails.currency,
          formData.billingDetails.paymentMethod,
          formData.billingDetails.autoRenew,
          formData.datesDetails.startDate,
          formData.datesDetails.nextBillingDate,
          formData.remindaerDaysBefore,
        );
        if (!response || !response.data) throw new Error('Failed to save');
        setSubscriptions(subs => [
          ...subs,
          { ...formData, _id: response.data._id || Date.now().toString() },
        ]);
      }
      setFormData(initialFormData);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleEditClick = sub => {
    setFormData(sub);
    setEditingId(sub._id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    try {
      await DeleteSubscription(id);
      setSubscriptions(subs => subs.filter(sub => sub._id !== id));
    } catch (err) {
      Alert.alert('Error', 'Failed to delete subscription');
    }
  };

  const renderSubscription = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status] || STATUS_COLORS.Default;
    return (
      <View
        style={{
          backgroundColor: 'rgba(23,23,23,0.8)',
          borderColor: '#27272a',
          borderWidth: 1,
          borderRadius: 16,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#d4d4d8', fontWeight: 'bold', fontSize: 18 }}>
                {item.subscriptionDetails.appName?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
            <View>
              <Text style={{ color: '#e5e5e5', fontWeight: 'bold', fontSize: 16 }}>
                {item.subscriptionDetails.appName}
              </Text>
              <Text style={{ color: '#a3a3a3', fontSize: 12 }}>
                {item.subscriptionDetails.category}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: statusColor.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: statusColor.text, fontWeight: 'bold', fontSize: 12 }}>
              {item.status}
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#e5e5e5', fontSize: 22, fontWeight: 'bold' }}>
            {item.billingDetails.currency === 'USD'
              ? '$'
              : item.billingDetails.currency === 'EUR'
              ? '€'
              : item.billingDetails.currency === 'GBP'
              ? '£'
              : '₹'}
            {item.billingDetails.amount}
            <Text style={{ color: '#a3a3a3', fontSize: 14, fontWeight: 'normal' }}>
              {' '}
              / {item.subscriptionDetails.planType?.toLowerCase()}
            </Text>
          </Text>
          {item.billingDetails.autoRenew && (
            <Text style={{ color: '#a3a3a3', fontSize: 12, marginTop: 2 }}>Auto-renews</Text>
          )}
        </View>
        <View style={{ borderBottomColor: '#27272a', borderBottomWidth: 1, marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#a3a3a3', fontSize: 13 }}>Payment</Text>
          <Text style={{ color: '#e5e5e5', fontSize: 13 }}>
            {item.billingDetails.paymentMethod}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#a3a3a3', fontSize: 13 }}>Next billing</Text>
          <Text style={{ color: '#e5e5e5', fontSize: 13 }}>
            {item.datesDetails.nextBillingDate}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#a3a3a3', fontSize: 13 }}>Reminder</Text>
          <Text style={{ color: '#e5e5e5', fontSize: 13 }}>
            {item.remindaerDaysBefore}d before
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#18181b',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              marginRight: 8,
            }}
            onPress={() => handleEditClick(item)}
          >
            <Text style={{ color: '#e5e5e5', fontSize: 13, fontWeight: 'bold' }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#18181b',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              flex: 1,
            }}
            onPress={() => handleDelete(item._id)}
          >
            <Text style={{ color: '#fb7185', fontSize: 13, fontWeight: 'bold' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#000' }}>
        <View style={{ paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={require('../../public/logo.png')}
              style={{ width: 40, height: 40 }}
            />
            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 24, color: '#e5e5e5' }}>
              Loopify
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Icon
              name="logout"
              size={30}
              color="#fff"
              style={{ backgroundColor: '#b91c1c', borderRadius: 20, padding: 6 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
  

        {showForm && (
          <View style={{ backgroundColor: '#18181b', borderRadius: 16, padding: 16, marginBottom: 16, borderColor: '#27272a', borderWidth: 1 }}>
            <Text style={{ color: '#fff', fontSize: 20, marginBottom: 12, fontFamily: 'Poppins-Bold' }}>
              {editingId ? 'Edit Subscription' : 'New Subscription'}
            </Text>
            {error ? (
              <Text style={{ color: '#fb7185', marginBottom: 8 }}>{error}</Text>
            ) : null}
            <TextInput
              placeholder="App Name"
              placeholderTextColor="#a3a3a3"
              value={formData.subscriptionDetails.appName}
              onChangeText={text => handleInputChange('subscriptionDetails', 'appName', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Category"
              placeholderTextColor="#a3a3a3"
              value={formData.subscriptionDetails.category}
              onChangeText={text => handleInputChange('subscriptionDetails', 'category', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Plan Type"
              placeholderTextColor="#a3a3a3"
              value={formData.subscriptionDetails.planType}
              onChangeText={text => handleInputChange('subscriptionDetails', 'planType', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Amount"
              placeholderTextColor="#a3a3a3"
              value={formData.billingDetails.amount}
              onChangeText={text => handleInputChange('billingDetails', 'amount', text)}
              keyboardType="numeric"
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Currency (USD, EUR, GBP, INR)"
              placeholderTextColor="#a3a3a3"
              value={formData.billingDetails.currency}
              onChangeText={text => handleInputChange('billingDetails', 'currency', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Payment Method"
              placeholderTextColor="#a3a3a3"
              value={formData.billingDetails.paymentMethod}
              onChangeText={text => handleInputChange('billingDetails', 'paymentMethod', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Start Date (YYYY-MM-DD)"
              placeholderTextColor="#a3a3a3"
              value={formData.datesDetails.startDate}
              onChangeText={text => handleInputChange('datesDetails', 'startDate', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Next Billing Date (YYYY-MM-DD)"
              placeholderTextColor="#a3a3a3"
              value={formData.datesDetails.nextBillingDate}
              onChangeText={text => handleInputChange('datesDetails', 'nextBillingDate', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Reminder Days Before"
              placeholderTextColor="#a3a3a3"
              value={formData.remindaerDaysBefore}
              onChangeText={text => handleSimpleChange('remindaerDaysBefore', text)}
              keyboardType="numeric"
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TextInput
              placeholder="Status (Active, Inactive, Paused, Cancelled)"
              placeholderTextColor="#a3a3a3"
              value={formData.status}
              onChangeText={text => handleSimpleChange('status', text)}
              style={{ backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 8,
              }}
              onPress={handleAddOrEdit}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                {editingId ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#18181b',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData(initialFormData);
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator color="#fff" size="large" style={{ marginTop: 32 }} />
        ) : subscriptions.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 64 }}>
            <Text style={{ color: '#e5e5e5', fontSize: 18, marginBottom: 8 }}>
              No active subscriptions
            </Text>
            <Text style={{ color: '#a3a3a3', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
              Track and manage all your subscriptions in one place
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 24,
                alignItems: 'center',
              }}
              onPress={() => setShowForm(true)}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>Add Subscription</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={subscriptions}
            renderItem={renderSubscription}
            keyExtractor={item => item._id?.toString() || Math.random().toString()}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </ScrollView>
    </View>
  );
};
