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
import { GetSubscription } from '../api/get/[...subscriptionApi]/subscription.api';
import { createSubscription } from '../api/post/[...subscriptionApi]/subscription.api';
import { DeleteSubscription } from '../api/delete/[...subscriptionApi]/subscription.api';
import { EditSubscription } from '../api/put/[...subscriptionApi]/subscription.api';

const STATUS_COLORS = {
  Active: { bg: 'rgba(16,185,129,0.1)', text: '#34d399' },
  Inactive: { bg: 'rgba(253,224,71,0.1)', text: '#fde047' },
  Paused: { bg: 'rgba(56,189,248,0.1)', text: '#38bdf8' },
  Cancelled: { bg: 'rgba(251,113,133,0.1)', text: '#fb7185' },
  Default: { bg: 'rgba(156,163,175,0.1)', text: '#9ca3af' },
};

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return dateString;
  }
};

const initialFormData = {
  subscriptionDetails: {
    appName: '',
    category: 'Productivity',
    planType: 'Monthly',
  },
  billingDetails: {
    amount: '',
    currency: 'USD',
    paymentMethod: 'Credit Card',
    autoRenew: false,
  },
  datesDetails: { startDate: '', nextBillingDate: '' },
  reminderDaysBefore: 7,
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
      await AsyncStorage.multiRemove(['token', 'userId', 'email']);
      const token = await AsyncStorage.getItem('token');
      navigate.reset({ index: 0, routes: [{ name: 'Landing' }] });
    } catch (error) {
      console.log('Error during logout:', error);
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
    if (
      !formData.subscriptionDetails.appName ||
      !formData.billingDetails.amount
    ) {
      setError('App name and amount are required');
      return;
    }
    try {
      if (editingId) {
        const response = await EditSubscription(editingId, formData);
        if (!response || !response.data) throw new Error('Failed to update');
      } else {
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
          formData.reminderDaysBefore,
          formData.status,
        );
        if (!response || !response.data) throw new Error('Failed to save');
      }
      
      await fetchSubscriptions();
      
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
        className="border-neutral-500"
        style={{
          borderWidth: 0.6,
          borderRadius: 16,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
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
              <Text
                style={{
                  color: '#d4d4d8',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 18,
                }}
              >
                {item.subscriptionDetails.appName?.charAt(0)?.toUpperCase() ||
                  '?'}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#e5e5e5',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                }}
              >
                {item.subscriptionDetails.appName}
              </Text>
              <Text
                style={{
                  color: '#a3a3a3',
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                }}
              >
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
            <Text
              style={{
                color: statusColor.text,
                fontFamily: 'Poppins-Regular',
                fontSize: 12,
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 22,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {item.billingDetails.currency === 'USD'
              ? '$'
              : item.billingDetails.currency === 'EUR'
                ? '€'
                : item.billingDetails.currency === 'GBP'
                  ? '£'
                  : '₹'}
            {item.billingDetails.amount}
            <Text
              style={{
                color: '#a3a3a3',
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
              }}
            >
              {' '}
              / {item.subscriptionDetails.planType?.toLowerCase()}
            </Text>
          </Text>
          {item.billingDetails.autoRenew && (
            <Text style={{ color: '#a3a3a3', fontSize: 12, marginTop: 2 }}>
              Auto-renews
            </Text>
          )}
        </View>
        <View
          style={{
            borderBottomColor: '#27272a',
            borderBottomWidth: 1,
            marginBottom: 12,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Payment
          </Text>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {item.billingDetails.paymentMethod}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Next billing
          </Text>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {formatDate(item.datesDetails.nextBillingDate)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Reminder
          </Text>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {item.reminderDaysBefore}d before
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
            <Text
              style={{
                color: '#e5e5e5',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}
            >
              Edit
            </Text>
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
            <Text
              style={{
                color: '#fb7185',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#000' }}>
        <View
          style={{
            paddingVertical: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#000',
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={require('../../public/logo.png')}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 24,
                color: '#e5e5e5',
              }}
            >
              Loopify
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {showForm && (
          <View
            style={{
              backgroundColor: '#18181b',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderColor: '#27272a',
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                marginBottom: 12,
                fontFamily: 'Poppins-Poppins-Regular',
              }}
            >
              {editingId ? 'Edit Subscription' : 'New Subscription'}
            </Text>
            {error ? (
              <Text style={{ color: '#fb7185', marginBottom: 8 }}>{error}</Text>
            ) : null}
            <TextInput
              placeholder="App Name"
              placeholderTextColor="#a3a3a3"
              value={formData.subscriptionDetails.appName}
              onChangeText={text =>
                handleInputChange('subscriptionDetails', 'appName', text)
              }
              style={{
                backgroundColor: '#27272a',
                color: '#fff',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            />

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#a3a3a3', fontSize: 12, marginBottom: 4 }}>
                Category
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {[
                  'Productivity',
                  'Education',
                  'Entertainment',
                  'Utility',
                  'Other',
                ].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={{
                      backgroundColor:
                        formData.subscriptionDetails.category === cat
                          ? '#34d399'
                          : '#27272a',
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderColor: '#444',
                      borderWidth: 1,
                    }}
                    onPress={() =>
                      handleInputChange('subscriptionDetails', 'category', cat)
                    }
                  >
                    <Text
                      style={{
                        color:
                          formData.subscriptionDetails.category === cat
                            ? '#000'
                            : '#e5e5e5',
                        fontSize: 11,
                        fontFamily: 'Poppins-Regular',
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#a3a3a3', fontSize: 12, marginBottom: 4 }}>
                Plan Type
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {['Monthly', 'Yearly', 'Free', 'Trial'].map(plan => (
                  <TouchableOpacity
                    key={plan}
                    style={{
                      flex: 1,
                      backgroundColor:
                        formData.subscriptionDetails.planType === plan
                          ? '#34d399'
                          : '#27272a',
                      borderRadius: 6,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderColor: '#444',
                      borderWidth: 1,
                    }}
                    onPress={() =>
                      handleInputChange('subscriptionDetails', 'planType', plan)
                    }
                  >
                    <Text
                      style={{
                        color:
                          formData.subscriptionDetails.planType === plan
                            ? '#000'
                            : '#e5e5e5',
                        fontSize: 11,
                        fontFamily: 'Poppins-Regular',
                      }}
                    >
                      {plan}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TextInput
              placeholder="Amount"
              placeholderTextColor="#a3a3a3"
              value={formData.billingDetails.amount}
              onChangeText={text =>
                handleInputChange('billingDetails', 'amount', text)
              }
              keyboardType="numeric"
              style={{
                backgroundColor: '#27272a',
                color: '#fff',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            />
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#a3a3a3', fontSize: 12, marginBottom: 4 }}>
                Currency
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {['USD', 'EUR', 'GBP', 'INR'].map(curr => (
                  <TouchableOpacity
                    key={curr}
                    style={{
                      flex: 1,
                      backgroundColor:
                        formData.billingDetails.currency === curr
                          ? '#34d399'
                          : '#27272a',
                      borderRadius: 6,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderColor: '#444',
                      borderWidth: 1,
                    }}
                    onPress={() =>
                      handleInputChange('billingDetails', 'currency', curr)
                    }
                  >
                    <Text
                      style={{
                        color:
                          formData.billingDetails.currency === curr
                            ? '#000'
                            : '#e5e5e5',
                        fontSize: 11,
                        fontFamily: 'Poppins-Regular',
                      }}
                    >
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#a3a3a3', fontSize: 12, marginBottom: 4 }}>
                Payment Method
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {['Credit Card', 'Debit Card', 'PayPal', 'Upi', 'Other'].map(
                  method => (
                    <TouchableOpacity
                      key={method}
                      style={{
                        backgroundColor:
                          formData.billingDetails.paymentMethod === method
                            ? '#34d399'
                            : '#27272a',
                        borderRadius: 6,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderColor: '#444',
                        borderWidth: 1,
                      }}
                      onPress={() =>
                        handleInputChange(
                          'billingDetails',
                          'paymentMethod',
                          method,
                        )
                      }
                    >
                      <Text
                        style={{
                          color:
                            formData.billingDetails.paymentMethod === method
                              ? '#000'
                              : '#e5e5e5',
                          fontSize: 10,
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#27272a',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: '#e5e5e5', fontSize: 13 }}>Auto Renew</Text>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: formData.billingDetails.autoRenew
                    ? '#34d399'
                    : '#444',
                  justifyContent: 'center',
                  alignItems: formData.billingDetails.autoRenew
                    ? 'flex-end'
                    : 'flex-start',
                  paddingHorizontal: 4,
                }}
                onPress={() =>
                  handleInputChange(
                    'billingDetails',
                    'autoRenew',
                    !formData.billingDetails.autoRenew,
                  )
                }
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#fff',
                  }}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Start Date (YYYY-MM-DD)"
              placeholderTextColor="#a3a3a3"
              value={formData.datesDetails.startDate}
              onChangeText={text =>
                handleInputChange('datesDetails', 'startDate', text)
              }
              style={{
                backgroundColor: '#27272a',
                color: '#fff',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            />
            <TextInput
              placeholder="Next Billing Date (YYYY-MM-DD)"
              placeholderTextColor="#a3a3a3"
              value={formData.datesDetails.nextBillingDate}
              onChangeText={text =>
                handleInputChange('datesDetails', 'nextBillingDate', text)
              }
              style={{
                backgroundColor: '#27272a',
                color: '#fff',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            />
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#a3a3a3', fontSize: 12, marginBottom: 4 }}>
                Reminder (Days Before)
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {[1, 3, 7, 14, 30].map(day => (
                  <TouchableOpacity
                    key={day}
                    style={{
                      flex: 1,
                      backgroundColor:
                        formData.reminderDaysBefore === day
                          ? '#34d399'
                          : '#27272a',
                      borderRadius: 6,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderColor: '#444',
                      borderWidth: 1,
                    }}
                    onPress={() =>
                      handleSimpleChange('reminderDaysBefore', day)
                    }
                  >
                    <Text
                      style={{
                        color:
                          formData.reminderDaysBefore === day
                            ? '#000'
                            : '#e5e5e5',
                        fontSize: 10,
                        fontFamily: 'Poppins-Regular',
                      }}
                    >
                      {day}d
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#a3a3a3', fontSize: 12, marginBottom: 4 }}>
                Status
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {['Active', 'Inactive', 'Paused', 'Cancelled'].map(stat => (
                  <TouchableOpacity
                    key={stat}
                    style={{
                      flex: 1,
                      backgroundColor:
                        formData.status === stat ? '#34d399' : '#27272a',
                      borderRadius: 6,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderColor: '#444',
                      borderWidth: 1,
                    }}
                    onPress={() => handleSimpleChange('status', stat)}
                  >
                    <Text
                      style={{
                        color: formData.status === stat ? '#000' : '#e5e5e5',
                        fontSize: 10,
                        fontFamily: 'Poppins-Regular',
                      }}
                    >
                      {stat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                }}
              >
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
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{ marginTop: 32 }}
          />
        ) : subscriptions.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 64 }}>
            <Text style={{ color: '#e5e5e5', fontSize: 18, marginBottom: 8 }}>
              No active subscriptions
            </Text>
            <Text
              style={{
                color: '#a3a3a3',
                fontSize: 14,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
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
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                }}
              >
                Add Subscription
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              className="bg-neutral-300 flex justify-center items-center"
              style={{
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
                alignItems: 'center',
                marginBottom: 16,
              }}
              onPress={() => {
                setFormData(initialFormData);
                setEditingId(null);
                setShowForm(true);
              }}
            >
              <Text
                className="text-black"
                style={{ fontFamily: 'Poppins-Regular', fontSize: 16 }}
              >
                Create Subscription
              </Text>
            </TouchableOpacity>
            <FlatList
              data={subscriptions}
              renderItem={renderSubscription}
              keyExtractor={item =>
                item._id?.toString() || Math.random().toString()
              }
              contentContainerStyle={{ paddingBottom: 32 }}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};
